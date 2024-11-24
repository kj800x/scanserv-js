import styled from "styled-components";
import { Scan } from "./gql/graphql";
import { Grid } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const CurrentGroupWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  flex: 1;
  max-height: 800px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ScanWrapper = styled.div`
  height: 100%;
  border: 1px solid black;
  aspect-ratio: 0.7225;

  display: flex;
  justify-content: center;
  align-items: center;
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
  group: Scan[];
}

export function CurrentGroup({ group }: CurrentGroupProps) {
  return (
    <CurrentGroupWrapper>
      {group.map((scan) => (
        <ScanWrapper key={scan.id}>
          {scan.status === "PENDING" && <Loader />}
          {scan.status === "FAILED" && <Error />}
          {scan.status === "COMPLETE" && <ScanImage src={scan.path} />}
        </ScanWrapper>
      ))}
    </CurrentGroupWrapper>
  );
}
