import { useMutation, useQuery } from "@apollo/client";
import { ADD_DIVIDER, OMNIBUS, RESCAN, SCAN } from "./queries";
import { OmnibusQuery, Scan, ScanDivider } from "./gql/graphql";
import { useState } from "react";
import { Toolbar } from "./Toolbar";
import { CurrentGroup } from "./CurrentGroup";
import { PreviousGroups } from "./PreviousGroups";
import styled from "styled-components";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

type FullTimelineEntry =
  | {
      type: "scan";
      ts: number;
      scan: Scan;
    }
  | {
      type: "divider";
      ts: number;
      divider: ScanDivider;
    };

/** And they said I'd never merge two lists */
function mergedTimeline(
  scans: Scan[],
  dividers: ScanDivider[]
): FullTimelineEntry[] {
  let scanIndex = 0;
  let dividerIndex = 0;

  const timeline: FullTimelineEntry[] = [];

  while (scanIndex < scans.length || dividerIndex < dividers.length) {
    const nextScan = scans[scanIndex];
    const nextDivider = dividers[dividerIndex];

    if (!nextScan && !nextDivider) {
      break;
    }

    if (!nextScan) {
      timeline.push({
        type: "divider",
        ts: new Date(nextDivider.ts).getTime(),
        divider: nextDivider,
      });
      dividerIndex++;
      continue;
    }

    if (!nextDivider) {
      timeline.push({
        type: "scan",
        ts: new Date(nextScan.scannedAt).getTime(),
        scan: nextScan,
      });
      scanIndex++;
      continue;
    }

    if (
      new Date(nextScan.scannedAt).getTime() <
      new Date(nextDivider.ts).getTime()
    ) {
      timeline.push({
        type: "scan",
        ts: new Date(nextScan.scannedAt).getTime(),
        scan: nextScan,
      });
      scanIndex++;
    } else {
      timeline.push({
        type: "divider",
        ts: nextDivider.ts,
        divider: nextDivider,
      });
      dividerIndex++;
    }
  }

  return timeline;
}

function groupScans(omnibus: OmnibusQuery) {
  const fullTimeline = mergedTimeline(omnibus.scans, omnibus.dividers);

  const groups: Scan[][] = [];
  let currentGroup: Scan[] = [];

  for (const entry of fullTimeline) {
    if (entry.type === "scan") {
      currentGroup.push(entry.scan);
    } else {
      groups.push(currentGroup);
      currentGroup = [];
    }
  }

  groups.push(currentGroup);

  return groups;
}

function App() {
  const [currentGroupRevIndex, setCurrentGroupRevIndex] = useState<number>(0);
  const [selectedScan, setSelectedScan] = useState<number | null>(null);

  const { data, error } = useQuery(OMNIBUS, { pollInterval: 1000 });
  const [scan] = useMutation(SCAN, {
    variables: {
      name: "pixma:MF240_10.60.1.74",
      parameters: JSON.stringify({ "--resolution": "300" }),
    },
    refetchQueries: [{ query: OMNIBUS }],
  });
  const [addDivider] = useMutation(ADD_DIVIDER, {
    refetchQueries: [{ query: OMNIBUS }],
  });
  const [rescan] = useMutation(RESCAN, {
    variables: {
      scanId: selectedScan!,
      name: "pixma:MF240_10.60.1.74",
      parameters: JSON.stringify({ "--resolution": "300" }),
    },
    refetchQueries: [{ query: OMNIBUS }],
  });

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const groups = groupScans(data);
  console.log({ currentGroupRevIndex });

  return (
    <AppWrapper>
      <Toolbar
        isLatestGroup={currentGroupRevIndex === 0}
        onScan={() => {
          scan();
          setSelectedScan(null);
        }}
        onRescan={() => {
          rescan();
          setSelectedScan(null);
        }}
        onDivider={() => {
          addDivider();
          setSelectedScan(null);
        }}
        selectedScan={selectedScan}
      />
      <CurrentGroup
        group={groups[groups.length - (1 + currentGroupRevIndex)]}
        selectedScan={selectedScan}
        setSelectedScan={setSelectedScan}
      />
      <PreviousGroups
        groups={groups}
        currentGroupRevIndex={currentGroupRevIndex}
        setCurrentGroupRevIndex={(idx) => {
          setCurrentGroupRevIndex(idx);
          setSelectedScan(null);
        }}
      />
    </AppWrapper>
  );
}

export default App;
