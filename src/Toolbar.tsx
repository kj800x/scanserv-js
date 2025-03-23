import styled from "styled-components";

const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #6a9fb5;

  border-bottom: 5px solid black;
`;

const ToolbarRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    font-size: 2rem;
    cursor: pointer;
  }

  input {
    padding: 0.5rem 1rem;
    font-size: 2rem;
  }
`;

interface ToolbarProps {
  isLatestGroup: boolean;
  onScan: () => void;
  onRescan: () => void;
  onDivider: () => void;
  onCommit: () => void;
  canCommit: boolean;
  selectedScan: number | null;
  title: string;
  setTitle: (title: string) => void;
}

export function Toolbar({
  isLatestGroup,
  onScan,
  onRescan,
  onDivider,
  onCommit,
  canCommit,
  selectedScan,
  title,
  setTitle,
}: ToolbarProps) {
  return (
    <ToolbarWrapper>
      <ToolbarRow>
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
      </ToolbarRow>
      <ToolbarRow>
        <input
          type="text"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Group title"
        />

        <button onClick={onCommit} disabled={!canCommit}>
          Commit
        </button>
      </ToolbarRow>
    </ToolbarWrapper>
  );
}
