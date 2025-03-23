import { useQuery } from "@apollo/client";
import { GROUPS, SCANS_BY_GROUP } from "./queries";
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

const ExportPageHeader = styled.div`
  padding: 20px;
  background-color: #444;
  color: white;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const GroupsListPanel = styled.div`
  width: 300px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  overflow-y: auto;
`;

const GroupItem = styled.div<{ selected: boolean }>`
  padding: 15px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#e9ecef" : "white")};
  border-bottom: 1px solid #dee2e6;

  &:hover {
    background-color: ${(props) => (props.selected ? "#e9ecef" : "#f8f9fa")};
  }
`;

const GroupTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
`;

const GroupMeta = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const GroupTags = styled.div`
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  display: inline-block;
  background-color: #e9ecef;
  padding: 3px 8px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 11px;
  color: #495057;
`;

const PreviewPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const GroupDetailsPanel = styled.div`
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #dee2e6;
`;

const GroupDetailTitle = styled.h2`
  margin: 0 0 10px 0;
  font-size: 20px;
`;

const GroupDescription = styled.p`
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #212529;
`;

const ScansPanel = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
`;

const ScanPreview = styled.div`
  margin: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScanImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
`;

const ScanInfo = styled.div`
  padding: 5px;
  font-size: 12px;
`;

const ActionsPanel = styled.div`
  padding: 20px;
  background-color: white;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin-left: 10px;
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

export function ExportPage() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const isServerOnline = useContext(ServerConnectionContext);

  // Fetch groups that are in 'finalized' status
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups,
  } = useQuery(GROUPS, {
    variables: { status: "finalized" },
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
    pollInterval: 1000,
  });

  // Combine all potential errors
  const error = groupsError || scansError;

  const groups: ScanGroup[] = useMemo(() => {
    return groupsData?.groups || [];
  }, [groupsData]);

  const scans: Scan[] = useMemo(() => {
    return scansData?.scansByGroup || [];
  }, [scansData]);

  const selectedGroupData = useMemo(() => {
    if (!selectedGroup) return null;
    return groups.find((group) => group.id === selectedGroup) || null;
  }, [selectedGroup, groups]);

  const handleExportPDF = () => {
    if (selectedGroup) {
      // Integration with PDF export would go here
      alert(`Exporting group ${selectedGroup} as PDF...`);
    }
  };

  const handleExportToPaperless = () => {
    if (selectedGroup) {
      // Integration with Paperless-NGX would go here
      alert(`Exporting group ${selectedGroup} to Paperless-NGX...`);
    }
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
      <ExportPageHeader>
        <Title>Export Finalized Documents</Title>
      </ExportPageHeader>

      <MainContent>
        <GroupsListPanel>
          {groups.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              No finalized groups available
            </div>
          ) : (
            groups.map((group) => (
              <GroupItem
                key={group.id}
                selected={group.id === selectedGroup}
                onClick={() => setSelectedGroup(group.id)}
              >
                <GroupTitle>{group.title || `Group ${group.id}`}</GroupTitle>
                <GroupMeta>
                  Created: {new Date(group.createdAt).toLocaleDateString()}
                </GroupMeta>
                {group.tags && group.tags.length > 0 && (
                  <GroupTags>
                    {group.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </GroupTags>
                )}
              </GroupItem>
            ))
          )}
        </GroupsListPanel>

        {selectedGroupData ? (
          <PreviewPanel>
            <GroupDetailsPanel>
              <GroupDetailTitle>
                {selectedGroupData.title || `Group ${selectedGroupData.id}`}
              </GroupDetailTitle>
              {selectedGroupData.comment && (
                <GroupDescription>{selectedGroupData.comment}</GroupDescription>
              )}
              {selectedGroupData.tags && selectedGroupData.tags.length > 0 && (
                <GroupTags>
                  {selectedGroupData.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </GroupTags>
              )}
            </GroupDetailsPanel>

            <ScansPanel>
              {scansLoading ? (
                <div>Loading scans...</div>
              ) : scans.length === 0 ? (
                <div>No scans in this group</div>
              ) : (
                scans.map((scan) => (
                  <ScanPreview key={scan.id}>
                    <ScanImage
                      src={scan.path}
                      alt={`Scan ${scan.id}`}
                      style={{ transform: `rotate(${scan.rotation || 0}deg)` }}
                    />
                    <ScanInfo>
                      ID: {scan.id}
                      <br />
                      {new Date(scan.scannedAt).toLocaleString()}
                    </ScanInfo>
                  </ScanPreview>
                ))
              )}
            </ScansPanel>

            <ActionsPanel>
              <ActionButton
                onClick={handleExportPDF}
                disabled={!selectedGroup || scans.length === 0}
              >
                Export as PDF
              </ActionButton>
              <ActionButton
                onClick={handleExportToPaperless}
                disabled={!selectedGroup || scans.length === 0}
              >
                Send to Paperless-NGX
              </ActionButton>
            </ActionsPanel>
          </PreviewPanel>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>Select a group to view and export</p>
          </div>
        )}
      </MainContent>
    </PageWrapper>
  );
}
