import styled from "styled-components";
import { Scan } from "./gql/graphql";

const PreviousGroupsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-top: 5px solid black;
`;

const PreviousGroup = styled.div<{ selected: boolean }>`
  height: 110px;
  width: 85px;
  border: 1px solid black;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${({ selected }) =>
    selected
      ? `
    background-color: black;
    color: white;
  `
      : `
    background-color: white;
    color: black;
  `}
`;

interface PreviousGroupsProps {
  groups: Scan[][];
  currentGroupRevIndex: number;
  setCurrentGroupRevIndex: (index: number) => void;
}

export function PreviousGroups({
  groups,
  currentGroupRevIndex,
  setCurrentGroupRevIndex,
}: PreviousGroupsProps) {
  return (
    <PreviousGroupsWrapper>
      {groups.map((group, index) => (
        <PreviousGroup
          key={index}
          onClick={() => setCurrentGroupRevIndex(groups.length - 1 - index)}
          selected={currentGroupRevIndex === groups.length - 1 - index}
        >
          {index === groups.length - 1
            ? "Latest group"
            : `${group.length} pages`}
        </PreviousGroup>
      ))}
    </PreviousGroupsWrapper>
  );
}
