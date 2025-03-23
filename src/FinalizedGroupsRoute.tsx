import { useQuery } from "@apollo/client";
import { OMNIBUS } from "./queries";
import { OmnibusQuery, Scan, ScanDivider } from "./gql/graphql";
import { useMemo, useState } from "react";
import { CurrentGroup } from "./CurrentGroup";
import { PreviousGroups } from "./PreviousGroups";
import styled from "styled-components";

const ScanRouteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #d8d8d8;
  flex: 1;
  overflow: hidden;
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

  return groups.filter((group) => group.every((scan) => scan.group));
}

interface Group {
  scans: Scan[];
  title: string;
  id: number;
}

export function FinalizedGroupsRoute() {
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);

  const { data, error } = useQuery(OMNIBUS, { pollInterval: 1000 });

  const groups: Group[] = useMemo(() => {
    if (!data) {
      return [];
    }

    const groupedScans = groupScans(data).filter((x) => x.length > 0);

    return groupedScans.map((scans) => ({
      scans,
      title: scans[0].group!.title,
      id: scans[0].group!.id,
    })) satisfies Group[];
  }, [data]);

  const currentGroup = useMemo(() => {
    return groups.find((group) => group.id === currentGroupId) ?? null;
  }, [groups, currentGroupId]);

  const groupTitles = useMemo(() => {
    const titles = new Map<number, string>();

    for (const group of groups) {
      titles.set(group.scans[0]!.id!, group.title);
    }

    return titles;
  }, [groups]);

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ScanRouteWrapper>
      <CurrentGroup
        group={currentGroup?.scans ?? []}
        selectedScan={null}
        setSelectedScan={() => {}}
      />
      <PreviousGroups
        groups={groups.map((group) => group.scans)}
        currentGroupRevIndex={
          groups.length -
          1 -
          groups.findIndex((group) => group.id === currentGroupId)
        }
        setCurrentGroupRevIndex={(idx) => {
          setCurrentGroupId(groups[groups.length - 1 - idx].id);
        }}
        groupTitles={groupTitles}
      />
    </ScanRouteWrapper>
  );
}
