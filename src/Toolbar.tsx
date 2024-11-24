import styled from "styled-components";

const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-bottom: 5px solid black;
`;

interface ToolbarProps {
  isLatestGroup: boolean;
  onScan: () => void;
  onDivider: () => void;
}

export function Toolbar({ isLatestGroup, onScan, onDivider }: ToolbarProps) {
  return (
    <ToolbarWrapper>
      <button onClick={onScan} disabled={!isLatestGroup}>
        Scan
      </button>
      <button onClick={onDivider} disabled={!isLatestGroup}>
        Add divider
      </button>
    </ToolbarWrapper>
  );
}
