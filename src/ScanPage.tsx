import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_GROUP,
  GROUPS,
  SCAN,
  SCANS_BY_GROUP,
  SCANNERS,
  OMNIBUS,
} from "./queries";
import { ScanGroup, ScannerInfo } from "./gql/graphql";
import { useMemo, useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FullPageError } from "./components/FullPageError";
import { ServerConnectionContext } from "./App";
import { GroupNavigationBar } from "./components/GroupNavigationBar";
import { CurrentGroup } from "./CurrentGroup";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #d8d8d8;
  flex: 1;
  overflow: hidden;
`;

const ScanPageToolbar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #444;
  color: white;
`;

const ToolbarButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ScannerSelector = styled.select`
  padding: 8px;
  margin-right: 10px;
  border-radius: 4px;
  border: none;
  min-width: 250px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export function ScanPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedScan, setSelectedScan] = useState<number | null>(null);
  const [selectedScanner, setSelectedScanner] = useState<string>("");
  const isServerOnline = useContext(ServerConnectionContext);

  const {
    data: omnibusData,
    loading: omnibusLoading,
    error: omnibusError,
  } = useQuery(OMNIBUS, {
    pollInterval: 1000,
  });

  // Fetch available scanners
  const {
    data: scannersData,
    loading: scannersLoading,
    error: scannersError,
  } = useQuery(SCANNERS, {
    pollInterval: 10000, // Refresh scanner list every 10 seconds
  });

  // Fetch scans for the selected group
  const {
    data: scansData,
    loading: scansLoading,
    error: scansError,
  } = useQuery(SCANS_BY_GROUP, {
    variables: { groupId: selectedGroupId },
    skip: !selectedGroupId,
    pollInterval: 100,
  });

  const [scan, { error: scanError }] = useMutation(SCAN, {
    variables: {
      name: selectedScanner,
      parameters: JSON.stringify({ "--resolution": "300" }),
      groupId: selectedGroupId,
    },
    refetchQueries: [
      { query: GROUPS, variables: { status: "scanning" } },
      { query: SCANS_BY_GROUP, variables: { groupId: selectedGroupId } },
    ],
  });

  // TODO: Unused, we need to implement this
  // const [rescan, { error: rescanError }] = useMutation(RESCAN, {
  //   variables: {
  //     scanId: selectedScan,
  //     name: selectedScanner,
  //     parameters: JSON.stringify({ "--resolution": "300" }),
  //   },
  //   refetchQueries: [
  //     { query: GROUPS, variables: { status: "scanning" } },
  //     { query: SCANS_BY_GROUP, variables: { groupId: selectedGroup } },
  //   ],
  // });

  const [createGroup, { error: createGroupError }] = useMutation(CREATE_GROUP, {
    variables: {
      status: "scanning",
    },
    refetchQueries: [
      { query: OMNIBUS },
      { query: GROUPS, variables: { status: "scanning" } },
    ],
  });

  // Combine all potential errors
  const error =
    omnibusError ||
    scansError ||
    scanError ||
    createGroupError ||
    scannersError;

  const scanners: ScannerInfo[] = useMemo(() => {
    return scannersData?.scanners || [];
  }, [scannersData]);

  // Set the first available scanner as default when the scanner list loads
  useEffect(() => {
    if (scanners.length > 0 && !selectedScanner) {
      setSelectedScanner(scanners[0].name);
    }
  }, [scanners, selectedScanner]);

  const handleCreateGroup = async () => {
    const result = await createGroup();
    if (result.data?.createGroup) {
      setSelectedGroupId(result.data.createGroup);
    }
    return result.data?.createGroup;
  };

  const handleScan = async () => {
    // Check if a scanner is selected
    if (!selectedScanner) {
      alert("Please select a scanner first");
      return;
    }

    let groupId = selectedGroupId;

    if (!groupId) {
      const newGroupId = await handleCreateGroup();
      groupId = newGroupId;
    }

    // Perform the scan - backend should create a PENDING scan entry
    scan({
      variables: {
        name: selectedScanner,
        parameters: JSON.stringify({ "--resolution": "300" }),
        groupId,
      },
    });

    setSelectedScan(null);
  };

  const currentGroup = useMemo<ScanGroup | null>(() => {
    return omnibusData?.incompleteGroups?.find(
      (group: ScanGroup) => group.id === selectedGroupId
    );
  }, [omnibusData?.incompleteGroups, selectedGroupId]);

  // const handleRescan = useCallback(() => {
  //   refetchOmnibus();
  //   if (selectedGroup) {
  //     refetchScans();
  //   }
  // }, [refetchOmnibus, refetchScans, selectedGroup]);

  // Group the scan groups by creation time
  const orderedGroups = useMemo<ScanGroup[]>(() => {
    if (!omnibusData?.incompleteGroups) return [];

    return [...omnibusData.incompleteGroups].sort(
      (a, b) =>
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );
  }, [omnibusData?.incompleteGroups]);

  if (omnibusLoading || scannersLoading) return <div>Loading...</div>;

  // Show full-page error if server is offline or there's another error
  if (!isServerOnline || error) {
    return (
      <PageWrapper>
        <FullPageError
          error={error || new Error("Unable to connect to the scanner server")}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ScanPageToolbar>
        <ToolbarButton
          onClick={handleScan}
          disabled={!selectedGroupId || !selectedScanner}
        >
          Scan
        </ToolbarButton>
        {selectedScan && (
          // TODO: Implement this
          <ToolbarButton disabled={!selectedScanner}>Rescan</ToolbarButton>
        )}

        <ScannerSelector
          value={selectedScanner}
          onChange={(e) => setSelectedScanner(e.target.value)}
        >
          <option value="">Select Scanner</option>
          {scannersData?.scanners.map((scanner: ScannerInfo) => (
            <option key={scanner.name} value={scanner.name}>
              {scanner.name} ({scanner.description})
            </option>
          ))}
        </ScannerSelector>
      </ScanPageToolbar>

      <MainContent>
        {scansLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading scans...
          </div>
        ) : scansData?.scans?.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            No scans available. Select a scanner and click "Scan" to start
            scanning.
          </div>
        ) : (
          <CurrentGroup
            group={currentGroup}
            selectedScanId={selectedScan}
            setSelectedScanId={setSelectedScan}
          />
        )}
      </MainContent>
      {!omnibusLoading && !omnibusError && (
        <GroupNavigationBar
          groups={orderedGroups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={(id) => {
            setSelectedGroupId(id);
            setSelectedScan(null);
          }}
          onCreateNewGroup={handleCreateGroup}
        />
      )}
    </PageWrapper>
  );
}
