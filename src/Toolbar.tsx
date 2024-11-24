import styled from "styled-components";

const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-bottom: 5px solid black;

  button {
    padding: 0.5rem 1rem;
    font-size: 2rem;
    cursor: pointer;
  }
`;

interface ToolbarProps {
  isLatestGroup: boolean;
  onScan: () => void;
  onRescan: () => void;
  onDivider: () => void;
  selectedScan: number | null;
}

export function Toolbar({
  isLatestGroup,
  onScan,
  onRescan,
  onDivider,
  selectedScan,
}: ToolbarProps) {
  return (
    <ToolbarWrapper>
      {selectedScan == null ? (
        <button onClick={onScan} disabled={!isLatestGroup}>
          Scan
        </button>
      ) : (
        <button onClick={onRescan}>Rescan</button>
      )}

      <button onClick={onDivider} disabled={!isLatestGroup}>
        Add divider
      </button>
    </ToolbarWrapper>
  );
}
