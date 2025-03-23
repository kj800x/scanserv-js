import { useMutation, useQuery } from "@apollo/client";
import {
  GROUPS,
  SCANS_BY_GROUP,
  UPDATE_GROUP,
  ROTATE_SCAN,
  CROP_SCAN,
  COMMIT_GROUP,
} from "./queries";
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
  flex: 2;
  overflow-y: auto;
`;

const ScanPreview = styled.div<{ selected: boolean }>`
  margin: 10px;
  padding: 5px;
  border: ${(props) =>
    props.selected ? "3px solid #007bff" : "1px solid #ccc"};
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: #007bff;
  }
`;

interface ScanImageProps {
  rotation?: number;
}

const ScanImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
`;

const ScanInfo = styled.div`
  padding: 5px;
  font-size: 12px;
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

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #343a40;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
`;

const TagsInput = styled.div`
  margin-top: 5px;
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
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedScan, setSelectedScan] = useState<number | null>(null);
  const [groupTitle, setGroupTitle] = useState<string>("");
  const [groupComment, setGroupComment] = useState<string>("");
  const [groupTags, setGroupTags] = useState<string[]>([]);
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

  const [updateGroup, { error: updateError }] = useMutation(UPDATE_GROUP, {
    refetchQueries: [{ query: GROUPS, variables: { status: "scanning" } }],
  });

  const [rotateScan, { error: rotateError }] = useMutation(ROTATE_SCAN, {
    refetchQueries: [
      { query: SCANS_BY_GROUP, variables: { groupId: selectedGroup } },
    ],
  });

  const [cropScan, { error: cropError }] = useMutation(CROP_SCAN, {
    refetchQueries: [
      { query: SCANS_BY_GROUP, variables: { groupId: selectedGroup } },
    ],
  });

  const [commitGroup, { error: commitError }] = useMutation(COMMIT_GROUP, {
    refetchQueries: [
      { query: GROUPS, variables: { status: "scanning" } },
      { query: GROUPS, variables: { status: "finalized" } },
    ],
  });

  // Combine all potential errors
  const error =
    groupsError ||
    scansError ||
    updateError ||
    rotateError ||
    cropError ||
    commitError;

  const groups: ScanGroup[] = useMemo(() => {
    return groupsData?.groups || [];
  }, [groupsData]);

  const scans: Scan[] = useMemo(() => {
    return scansData?.scansByGroup || [];
  }, [scansData]);

  // Update local state when a group is selected
  useMemo(() => {
    if (selectedGroup) {
      const group = groups.find((g) => g.id === selectedGroup);
      if (group) {
        setGroupTitle(group.title || "");
        setGroupComment(group.comment || "");
        setGroupTags(group.tags || []);
      }
    }
  }, [selectedGroup, groups]);

  const handleRotateLeft = () => {
    if (selectedScan) {
      const scan = scans.find((s) => s.id === selectedScan);
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
      const scan = scans.find((s) => s.id === selectedScan);
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
    if (selectedGroup) {
      updateGroup({
        variables: {
          id: selectedGroup,
          title: groupTitle,
          comment: groupComment,
          tags: groupTags,
        },
      });
    }
  };

  const handleFinalizeGroup = () => {
    if (selectedGroup && scans.length > 0) {
      const scanIds = scans.map((scan) => scan.id);
      commitGroup({
        variables: {
          scanIds,
          title: groupTitle || `Group ${selectedGroup}`,
        },
      });
      setSelectedGroup(null);
      setSelectedScan(null);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !groupTags.includes(newTag.trim())) {
      setGroupTags([...groupTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setGroupTags(groupTags.filter((t) => t !== tag));
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
      <EditPageToolbar>
        <GroupSelector
          value={selectedGroup || ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedGroup(value ? Number(value) : null);
            setSelectedScan(null);
          }}
        >
          <option value="">Select a group to edit</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title || `Group ${group.id}`}
            </option>
          ))}
        </GroupSelector>

        <ToolbarButton onClick={handleSaveGroup} disabled={!selectedGroup}>
          Save Group
        </ToolbarButton>

        <ToolbarButton
          onClick={handleFinalizeGroup}
          disabled={!selectedGroup || scans.length === 0}
        >
          Finalize Group
        </ToolbarButton>
      </EditPageToolbar>

      <MainContent>
        <ScansContainer>
          {!selectedGroup ? (
            <div style={{ padding: "20px" }}>
              Select a group to edit its scans
            </div>
          ) : scansLoading ? (
            <div>Loading scans...</div>
          ) : scans.length === 0 ? (
            <div style={{ padding: "20px" }}>No scans in this group</div>
          ) : (
            scans.map((scan) => (
              <ScanPreview
                key={scan.id}
                selected={scan.id === selectedScan}
                onClick={() => setSelectedScan(scan.id)}
              >
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
        </ScansContainer>

        {selectedGroup && (
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
                  {groupTags.map((tag) => (
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
    </PageWrapper>
  );
}
