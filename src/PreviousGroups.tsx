import styled from "styled-components";
import { Scan } from "./gql/graphql";

const PreviousGroupsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-top: 5px solid black;
  overflow-x: scroll;
  background-color: #6a9fb5;
`;

const PreviousGroup = styled.div<{ selected: boolean }>`
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
  gap: 1rem;

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

interface PreviousGroupsProps {
  groups: Scan[][];
  currentGroupRevIndex: number;
  setCurrentGroupRevIndex: (index: number) => void;
  groupTitles: Map<number, string>;
}

export function PreviousGroups({
  groups,
  currentGroupRevIndex,
  setCurrentGroupRevIndex,
  groupTitles,
}: PreviousGroupsProps) {
  return (
    <PreviousGroupsWrapper>
      {groups.map((group, index) => {
        const firstScanId = group.length > 0 ? group[0].id! : null;
        const title =
          firstScanId !== null ? groupTitles.get(firstScanId) : null;

        return (
          <PreviousGroup
            key={index}
            onClick={() => setCurrentGroupRevIndex(groups.length - 1 - index)}
            selected={currentGroupRevIndex === groups.length - 1 - index}
          >
            {title ? <div>{title}</div> : null}
            <div>
              {index === groups.length - 1
                ? "Latest group"
                : `${group.length} pages`}
            </div>
          </PreviousGroup>
        );
      })}
    </PreviousGroupsWrapper>
  );
}
