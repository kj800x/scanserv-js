import styled from "styled-components";
import { ScanGroup } from "./gql/graphql";
import { Grid } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const CurrentGroupWrapper = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
`;

const PagesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  height: 100%;
`;

const ScanWrapper = styled.div<{
  $selected: boolean;
  $failed: boolean;
  $loading: boolean;
  $rotation: number;
}>`
  height: 100%;
  border: 2px solid black;
  aspect-ratio: 0.7225;

  max-height: 800px;

  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(${(props) => props.$rotation}deg);
  ${({ $rotation }) => ($rotation % 180 === 90 ? `margin: 100px;` : ``)}

  ${({ $selected }) => ($selected ? `border-color: orange;` : ``)}
  ${({ $failed }) => ($failed ? `background-color: #ffcece;` : ``)}
  ${({ $loading }) => ($loading ? `background-color: #daffda;` : ``)}
`;
const ScanImage = styled.img`
  height: 100%;
`;

function Loader() {
  return (
    <Grid
      visible={true}
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="grid-loading"
      radius="12.5"
      wrapperStyle={{}}
      wrapperClass="grid-wrapper"
    />
  );
}

function Error() {
  return (
    <FontAwesomeIcon icon={faTriangleExclamation} size="8x" color="darkred" />
  );
}

interface CurrentGroupProps {
  group: ScanGroup | null;
  selectedScanId: number | null;
  setSelectedScanId: (id: number | null) => void;
}

export function CurrentGroup({
  group,
  selectedScanId,
  setSelectedScanId,
}: CurrentGroupProps) {
  if (!group) {
    return (
      <CurrentGroupWrapper>
        <PagesWrapper />
      </CurrentGroupWrapper>
    );
  }

  console.log(group);

  return (
    <CurrentGroupWrapper>
      <PagesWrapper>
        {group.scans.map((scan) => (
          <ScanWrapper
            key={scan.id}
            $selected={scan.id === selectedScanId}
            $loading={scan.status === "PENDING"}
            $failed={scan.status === "FAILED"}
            $rotation={scan.rotation}
            onClick={() => {
              if (selectedScanId === scan.id) {
                setSelectedScanId(null);
              } else {
                setSelectedScanId(scan.id!);
              }
            }}
          >
            {scan.status === "PENDING" && <Loader />}
            {scan.status === "FAILED" && <Error />}
            {scan.status === "COMPLETE" && (
              <ScanImage
                src={scan.path}
                // cropCoordinates={scan.cropCoordinates}
              />
            )}
          </ScanWrapper>
        ))}
      </PagesWrapper>
    </CurrentGroupWrapper>
  );
}
