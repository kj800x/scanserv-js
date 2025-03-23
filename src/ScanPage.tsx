import { useMutation, useQuery } from "@apollo/client";
import { CREATE_GROUP, GROUPS, SCAN, RESCAN, SCANS_BY_GROUP } from "./queries";
import { Scan, ScanGroup } from "./gql/graphql";
import { useMemo, useState, useContext, useCallback } from "react";
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

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ScansContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  flex: 1;
  overflow-y: auto;
`;

const ScanPreview = styled.div<{ selected: boolean; status: string }>`
  margin: 10px;
  padding: 5px;
  border: ${(props) =>
    props.selected ? "3px solid #007bff" : "1px solid #ccc"};
  border-radius: 4px;
  background-color: ${(props) => {
    if (props.status === "FAILED") return "#ffdddd"; // Light red for failed scans
    if (props.status === "PENDING") return "#ddffdd"; // Light green for pending scans
    return "white"; // Default white for completed scans
  }};
  cursor: pointer;
  width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  &:hover {
    border-color: #007bff;
  }
`;

const ScanImageContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;

const ScanImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
`;

const ScanPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  background-color: #f5f5f5;
  color: #999;
  font-size: 14px;
`;

const ScanInfo = styled.div`
  padding: 5px;
  font-size: 12px;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
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
      name: "pixma:MF240_10.60.1.74",
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
      name: "pixma:MF240_10.60.1.74",
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
    groupsError || scansError || scanError || rescanError || createGroupError;

  const groups: ScanGroup[] = useMemo(() => {
    return groupsData?.groups || [];
  }, [groupsData]);

  const scans: Scan[] = useMemo(() => {
    return scansData?.scansByGroup || [];
  }, [scansData]);

  const handleCreateGroup = async () => {
    const result = await createGroup();
    if (result.data?.createGroup) {
      setSelectedGroup(result.data.createGroup);
    }
    return result.data?.createGroup;
  };

  const handleScan = async () => {
    let groupId = selectedGroup;

    if (!groupId) {
      const newGroupId = await handleCreateGroup();
      groupId = newGroupId;
    }

    // Perform the scan - backend should create a PENDING scan entry
    scan({
      variables: {
        name: "pixma:MF240_10.60.1.74",
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

  if (groupsLoading) return <div>Loading groups...</div>;

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

        <ToolbarButton onClick={handleScan}>Scan</ToolbarButton>

        <ToolbarButton
          onClick={() => {
            if (selectedScan) {
              // Execute the actual rescan - backend should create a PENDING scan
              rescan({
                variables: {
                  scanId: selectedScan,
                  name: "pixma:MF240_10.60.1.74",
                  parameters: JSON.stringify({ "--resolution": "300" }),
                },
              });

              setSelectedScan(null);
            }
          }}
          disabled={!selectedScan}
        >
          Rescan
        </ToolbarButton>

        <ToolbarButton onClick={handleCreateGroup}>New Group</ToolbarButton>
      </ScanPageToolbar>

      <MainContent>
        <ScansContainer>
          {scansLoading ? (
            <div>Loading scans...</div>
          ) : (
            scans.map((scan) => (
              <ScanPreview
                key={scan.id}
                selected={scan.id === selectedScan}
                status={scan.status}
                onClick={() => setSelectedScan(scan.id)}
              >
                {scan.path ? (
                  <ScanImage src={scan.path} alt={`Scan ${scan.id}`} />
                ) : (
                  <ScanPlaceholder>Scan in progress...</ScanPlaceholder>
                )}
                {scan.status === "PENDING" && <LoadingSpinner />}
                <ScanInfo>
                  ID: {scan.id}
                  <br />
                  Status: {scan.status}
                  <br />
                  {new Date(scan.scannedAt).toLocaleString()}
                </ScanInfo>
              </ScanPreview>
            ))
          )}
        </ScansContainer>
      </MainContent>
    </PageWrapper>
  );
}
