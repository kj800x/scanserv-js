import styled from "styled-components";
import { ScanGroup } from "../gql/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileLines } from "@fortawesome/free-solid-svg-icons";

const GroupNavigationBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-top: 5px solid black;
  overflow-x: auto;
  background-color: #6a9fb5;
`;

const GroupButton = styled.div<{ selected: boolean }>`
  height: 110px;
  min-width: 85px;
  max-width: 85px;
  border: 1px solid black;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  cursor: pointer;

  ${({ selected }) =>
    selected
      ? `
    background-color: #3B3B3B;
    color: #F5F5F2;
  `
      : `
    background-color: #F5F5F2;
    color: #1E3A5F;
  `}
`;

const NewGroupButton = styled(GroupButton)`
  border: 2px dashed black;
`;

const GroupLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const GroupPageCount = styled.div`
  font-size: 12px;
`;

interface GroupNavigationBarProps {
  groups: ScanGroup[];
  selectedGroupId: number | null;
  onSelectGroup: (id: number) => void;
  onCreateNewGroup?: () => void;
  newGroupSelected?: boolean;
}

export function GroupNavigationBar({
  groups,
  selectedGroupId,
  onSelectGroup,
  onCreateNewGroup,
  newGroupSelected = false,
}: GroupNavigationBarProps) {
  console.log(groups);

  return (
    <GroupNavigationBarWrapper>
      {groups.map((group, index) => {
        return (
          <GroupButton
            key={index}
            onClick={() => onSelectGroup(group.id)}
            selected={selectedGroupId === group.id}
          >
            <FontAwesomeIcon icon={faFileLines} size="2x" />

            {group.title ? (
              <GroupLabel>{group.title}</GroupLabel>
            ) : (
              <GroupLabel>Group {index + 1}</GroupLabel>
            )}

            <GroupPageCount>{group.scans.length} pages</GroupPageCount>
          </GroupButton>
        );
      })}
      {onCreateNewGroup && (
        <NewGroupButton onClick={onCreateNewGroup} selected={newGroupSelected}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
          <GroupLabel>New Group</GroupLabel>
        </NewGroupButton>
      )}
    </GroupNavigationBarWrapper>
  );
}
