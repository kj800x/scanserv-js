import { useMutation, useQuery } from "@apollo/client";
import {
  GROUPS,
  SCANS_BY_GROUP,
  UPDATE_GROUP,
  ROTATE_SCAN,
  COMMIT_GROUP,
} from "./queries";
import { ScanGroup } from "./gql/graphql";
import { useMemo, useState, useContext, useCallback } from "react";
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

const EditPageToolbar = styled.div`
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

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ScansContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  flex: 2;
  overflow-y: auto;
`;

const EditSidebar = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #f8f9fa;
  border-left: 1px solid #dee2e6;
  overflow-y: auto;
`;

const EditControls = styled.div`
  margin-bottom: 20px;
`;

const EditControlsTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #343a40;
`;

const RotationControls = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const GroupMetadata = styled.div`
  margin-top: 30px;
`;

const FormField = styled.div`
  margin-bottom: 15px;
`;

const Tag = styled.span`
  display: inline-block;
  background-color: #e9ecef;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 12px;

  button {
    background: none;
    border: none;
    margin-left: 5px;
    cursor: pointer;
    color: #dc3545;
    font-weight: bold;
  }
`;

export function EditPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedScan, setSelectedScan] = useState<number | null>(null);
  const [groupTitle, setGroupTitle] = useState<string>("");
  const [groupComment, setGroupComment] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const isServerOnline = useContext(ServerConnectionContext);

  // Fetch groups that are in 'scanning' status for editing
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError,
    refetch: refetchGroups,
  } = useQuery(GROUPS, {
    variables: { status: "scanning" },
    pollInterval: 1000,
  });

  const [updateGroup, { error: updateError }] = useMutation(UPDATE_GROUP, {
    refetchQueries: [{ query: GROUPS, variables: { status: "scanning" } }],
  });

  const [rotateScan, { error: rotateError }] = useMutation(ROTATE_SCAN, {
    refetchQueries: [
      { query: SCANS_BY_GROUP, variables: { groupId: selectedGroupId } },
    ],
  });

  const [commitGroup, { error: commitError }] = useMutation(COMMIT_GROUP, {
    refetchQueries: [
      { query: GROUPS, variables: { status: "scanning" } },
      { query: GROUPS, variables: { status: "finalized" } },
    ],
  });

  // Combine all potential errors
  const error = groupsError || updateError || rotateError || commitError;

  const groups: ScanGroup[] = useMemo(() => {
    return groupsData?.groups || [];
  }, [groupsData]);

  const currentGroup = useMemo<ScanGroup | null>(() => {
    return groups.find((g) => g.id === selectedGroupId) || null;
  }, [groups, selectedGroupId]);

  // Update local state when a group is selected
  useMemo(() => {
    if (selectedGroupId) {
      const group = groups.find((g) => g.id === selectedGroupId);
      if (group) {
        setGroupTitle(group.title || "");
        setGroupComment(group.comment || "");
        setTags(group.tags || []);
      }
    }
  }, [selectedGroupId, groups]);

  const handleRotateLeft = () => {
    if (selectedScan) {
      const scan = currentGroup?.scans.find((s) => s.id === selectedScan);
      if (scan) {
        const currentRotation = scan.rotation || 0;
        const newRotation = (currentRotation - 90 + 360) % 360;
        rotateScan({
          variables: {
            scanId: selectedScan,
            rotation: newRotation,
          },
        });
      }
    }
  };

  const handleRotateRight = () => {
    if (selectedScan) {
      const scan = currentGroup?.scans.find((s) => s.id === selectedScan);
      if (scan) {
        const currentRotation = scan.rotation || 0;
        const newRotation = (currentRotation + 90) % 360;
        rotateScan({
          variables: {
            scanId: selectedScan,
            rotation: newRotation,
          },
        });
      }
    }
  };

  const handleSaveGroup = () => {
    if (selectedGroupId) {
      updateGroup({
        variables: {
          id: selectedGroupId,
          title: groupTitle,
          comment: groupComment,
          tags: tags,
        },
      });
    }
  };

  const handleFinalizeGroup = () => {
    if (selectedGroupId && currentGroup && currentGroup.scans.length > 0) {
      const scanIds = currentGroup.scans.map((scan) => scan.id);
      commitGroup({
        variables: {
          scanIds,
          title: groupTitle || `Group ${selectedGroupId}`,
        },
      });
      setSelectedGroupId(null);
      setSelectedScan(null);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleRetry = useCallback(() => {
    refetchGroups();
  }, [refetchGroups]);

  // Function to handle group selection from the navigation bar
  const handleSelectGroup = useCallback(
    (groupId: number | null) => {
      setSelectedGroupId(groupId);
      setSelectedScan(null);

      // Reset form fields when changing groups
      if (groupId === null) {
        setGroupTitle("");
        setGroupComment("");
        setTags([]);
      } else {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          setGroupTitle(group.title || "");
          setGroupComment(group.comment || "");
          setTags(group.tags || []);
        }
      }
    },
    [groups]
  );

  const canFinalize =
    selectedGroupId && currentGroup && currentGroup.scans.length > 0;

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
      <EditPageToolbar>
        <ToolbarButton onClick={handleSaveGroup} disabled={!selectedGroupId}>
          Save Changes
        </ToolbarButton>
        <ToolbarButton
          onClick={handleFinalizeGroup}
          disabled={!selectedGroupId || !canFinalize}
        >
          Finalize Group
        </ToolbarButton>
      </EditPageToolbar>

      <MainContent>
        <ScansContainer>
          {!selectedGroupId ? (
            <div style={{ padding: "20px" }}>
              Select a group to edit its scans
            </div>
          ) : currentGroup && currentGroup.scans.length === 0 ? (
            <div style={{ padding: "20px" }}>No scans in this group</div>
          ) : (
            <CurrentGroup
              group={currentGroup}
              selectedScanId={selectedScan}
              setSelectedScanId={setSelectedScan}
            />
          )}
        </ScansContainer>

        {selectedGroupId && (
          <EditSidebar>
            {selectedScan ? (
              <EditControls>
                <EditControlsTitle>Edit Scan</EditControlsTitle>
                <RotationControls>
                  <ToolbarButton onClick={handleRotateLeft}>
                    ↺ Rotate Left
                  </ToolbarButton>
                  <ToolbarButton onClick={handleRotateRight}>
                    ↻ Rotate Right
                  </ToolbarButton>
                </RotationControls>
              </EditControls>
            ) : (
              <div>Select a scan to edit</div>
            )}

            <GroupMetadata>
              <EditControlsTitle>Group Metadata</EditControlsTitle>
              <FormField>
                <label htmlFor="title">Title:</label>
                <input
                  id="title"
                  type="text"
                  value={groupTitle}
                  onChange={(e) => setGroupTitle(e.target.value)}
                  style={{ width: "100%", padding: "5px" }}
                />
              </FormField>

              <FormField>
                <label htmlFor="comment">Comment:</label>
                <textarea
                  id="comment"
                  value={groupComment}
                  onChange={(e) => setGroupComment(e.target.value)}
                  style={{ width: "100%", padding: "5px", minHeight: "100px" }}
                />
              </FormField>

              <FormField>
                <label>Tags:</label>
                <div style={{ marginBottom: "10px" }}>
                  {tags.map((tag) => (
                    <Tag key={tag}>
                      {tag}
                      <span
                        onClick={() => handleRemoveTag(tag)}
                        style={{
                          marginLeft: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ×
                      </span>
                    </Tag>
                  ))}
                </div>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    style={{ flex: 1, padding: "5px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddTag}
                    style={{
                      marginLeft: "5px",
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Add
                  </button>
                </div>
              </FormField>
            </GroupMetadata>
          </EditSidebar>
        )}
      </MainContent>
      {!groupsLoading && !groupsError && (
        <GroupNavigationBar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={handleSelectGroup}
        />
      )}
    </PageWrapper>
  );
}
