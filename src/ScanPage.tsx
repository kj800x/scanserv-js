import { useMutation, useQuery, gql } from "@apollo/client";
import {
  CREATE_GROUP,
  GROUPS,
  SCAN,
  RESCAN,
  SCANS_BY_GROUP,
  SCANNERS,
} from "./queries";
import { Scan, ScanGroup, ScannerInfo } from "./gql/graphql";
import { useMemo, useState, useContext, useCallback, useEffect } from "react";
import styled from "styled-components";
import { FullPageError } from "./components/FullPageError";
import { ServerConnectionContext } from "./App";

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

const GroupSelector = styled.select`
  padding: 8px;
  margin-right: 10px;
  border-radius: 4px;
  border: none;
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

const ScansContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  overflow-x: auto;
  flex: 1;
  align-items: center;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;

  /* Ensure the scrollbar appears at the bottom */
  margin-bottom: 0;
  padding-bottom: 20px;

  &::-webkit-scrollbar {
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ScanPreview = styled.div<{ selected: boolean; status: string }>`
  margin: 0 20px;
  padding: 15px;
  border: ${(props) =>
    props.selected ? "5px solid #007bff" : "2px solid #ccc"};
  border-radius: 10px;
  background-color: ${(props) => {
    if (props.status === "FAILED") return "#ffdddd"; // Light red for failed scans
    if (props.status === "PENDING") return "#ddffdd"; // Light green for pending scans
    return "white"; // Default white for completed scans
  }};
  cursor: pointer;

  min-width: 600px;
  max-height: 100%;

  flex: 1;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    border-color: #007bff;
  }

  &:first-child {
    margin-left: 10px;
  }

  &:last-child {
    margin-right: 10px;
  }
`;

const ScanImageContainer = styled.div`
  border-radius: 6px;
`;

const ScanImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const ScanPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  aspect-ratio: 0.72291904218;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 18px;
  color: #888;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
  color: #d9534f;
`;

const ScanFooter = styled.div`
  padding: 12px 8px 8px 8px;
  font-size: 14px;
  border-top: 1px solid #eee;
  margin-top: 10px;
  color: #555;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export function ScanPage() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedScan, setSelectedScan] = useState<number | null>(null);
  const [selectedScanner, setSelectedScanner] = useState<string>("");
  const isServerOnline = useContext(ServerConnectionContext);

  // Fetch groups that are in 'scanning' status
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups,
  } = useQuery(GROUPS, {
    variables: { status: "scanning" },
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
    refetch: refetchScans,
  } = useQuery(SCANS_BY_GROUP, {
    variables: { groupId: selectedGroup },
    skip: !selectedGroup,
    pollInterval: 100,
  });

  const [scan, { error: scanError }] = useMutation(SCAN, {
    variables: {
      name: selectedScanner,
      parameters: JSON.stringify({ "--resolution": "300" }),
      groupId: selectedGroup,
    },
    refetchQueries: [
      { query: GROUPS, variables: { status: "scanning" } },
      { query: SCANS_BY_GROUP, variables: { groupId: selectedGroup } },
    ],
  });

  const [rescan, { error: rescanError }] = useMutation(RESCAN, {
    variables: {
      scanId: selectedScan,
      name: selectedScanner,
      parameters: JSON.stringify({ "--resolution": "300" }),
    },
    refetchQueries: [
      { query: GROUPS, variables: { status: "scanning" } },
      { query: SCANS_BY_GROUP, variables: { groupId: selectedGroup } },
    ],
  });

  const [createGroup, { error: createGroupError }] = useMutation(CREATE_GROUP, {
    variables: {
      title: "New Scan Group",
      status: "scanning",
    },
    refetchQueries: [{ query: GROUPS, variables: { status: "scanning" } }],
  });

  // Combine all potential errors
  const error =
    groupsError ||
    scansError ||
    scanError ||
    rescanError ||
    createGroupError ||
    scannersError;

  const groups: ScanGroup[] = useMemo(() => {
    return groupsData?.groups || [];
  }, [groupsData]);

  const scans: Scan[] = useMemo(() => {
    return scansData?.scansByGroup || [];
  }, [scansData]);

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
      setSelectedGroup(result.data.createGroup);
    }
    return result.data?.createGroup;
  };

  const handleScan = async () => {
    // Check if a scanner is selected
    if (!selectedScanner) {
      alert("Please select a scanner first");
      return;
    }

    let groupId = selectedGroup;

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

  const handleRetry = useCallback(() => {
    refetchGroups();
    if (selectedGroup) {
      refetchScans();
    }
  }, [refetchGroups, refetchScans, selectedGroup]);

  if (groupsLoading || scannersLoading) return <div>Loading...</div>;

  // Show full-page error if server is offline or there's another error
  if (!isServerOnline || error) {
    return (
      <PageWrapper>
        <FullPageError
          error={error || new Error("Unable to connect to the scanner server")}
          onRetry={handleRetry}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ScanPageToolbar>
        <GroupSelector
          value={selectedGroup || ""}
          onChange={(e) => setSelectedGroup(Number(e.target.value) || null)}
        >
          <option value="">Select a group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title || `Group ${group.id}`}
            </option>
          ))}
        </GroupSelector>

        <ScannerSelector
          value={selectedScanner}
          onChange={(e) => setSelectedScanner(e.target.value)}
        >
          <option value="">Select a scanner</option>
          {scanners.map((scanner) => (
            <option key={scanner.name} value={scanner.name}>
              {scanner.name} - {scanner.description}
            </option>
          ))}
        </ScannerSelector>

        <ToolbarButton onClick={handleScan} disabled={!selectedScanner}>
          Scan
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            if (selectedScan && selectedScanner) {
              // Execute the actual rescan - backend should create a PENDING scan
              rescan({
                variables: {
                  scanId: selectedScan,
                  name: selectedScanner,
                  parameters: JSON.stringify({ "--resolution": "300" }),
                },
              });

              setSelectedScan(null);
            }
          }}
          disabled={!selectedScan || !selectedScanner}
        >
          Rescan
        </ToolbarButton>

        <ToolbarButton onClick={handleCreateGroup}>New Group</ToolbarButton>
      </ScanPageToolbar>

      <MainContent>
        {scansLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading scans...
          </div>
        ) : scans.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            No scans available. Select a scanner and click "Scan" to start
            scanning.
          </div>
        ) : (
          <ScansContainer>
            {scans.map((scan) => (
              <ScanPreview
                key={scan.id}
                selected={scan.id === selectedScan}
                status={scan.status}
                onClick={() => setSelectedScan(scan.id)}
              >
                <ScanImageContainer>
                  {scan.status === "COMPLETE" && (
                    <ScanImage src={scan.path} alt={`Scan ${scan.id}`} />
                  )}
                  {scan.status === "PENDING" && (
                    <>
                      <ScanPlaceholder>Scanning in progress...</ScanPlaceholder>
                    </>
                  )}
                  {scan.status === "FAILED" && (
                    <ScanPlaceholder>
                      <div style={{ textAlign: "center" }}>
                        <ErrorIcon>⚠️</ErrorIcon>
                        <div>Scan failed</div>
                      </div>
                    </ScanPlaceholder>
                  )}
                </ScanImageContainer>

                <ScanFooter>
                  ID: {scan.id} • Status: {scan.status}
                  <br />
                  {new Date(scan.scannedAt).toLocaleString()}
                </ScanFooter>
              </ScanPreview>
            ))}
          </ScansContainer>
        )}
      </MainContent>
    </PageWrapper>
  );
}
