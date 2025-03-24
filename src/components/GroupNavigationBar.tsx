import styled from "styled-components";
import { Scan } from "../gql/graphql";
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
  groups: Scan[][];
  selectedGroupIndex: number;
  onSelectGroup: (index: number) => void;
  onCreateNewGroup: () => void;
  groupTitles?: Map<number, string>;
}

export function GroupNavigationBar({
  groups,
  selectedGroupIndex,
  onSelectGroup,
  onCreateNewGroup,
  groupTitles = new Map(),
}: GroupNavigationBarProps) {
  return (
    <GroupNavigationBarWrapper>
      {groups.map((group, index) => {
        const firstScanId = group.length > 0 ? group[0].id! : null;
        const title =
          firstScanId !== null ? groupTitles.get(firstScanId) : null;

        return (
          <GroupButton
            key={index}
            onClick={() => onSelectGroup(index)}
            selected={selectedGroupIndex === index}
          >
            <FontAwesomeIcon icon={faFileLines} size="2x" />

            {title ? (
              <GroupLabel>{title}</GroupLabel>
            ) : (
              <GroupLabel>Group {index + 1}</GroupLabel>
            )}

            <GroupPageCount>{group.length} pages</GroupPageCount>
          </GroupButton>
        );
      })}

      <NewGroupButton onClick={onCreateNewGroup} selected={false}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
        <GroupLabel>New Group</GroupLabel>
      </NewGroupButton>
    </GroupNavigationBarWrapper>
  );
}
