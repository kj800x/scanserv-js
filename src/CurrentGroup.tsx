import styled from "styled-components";
import { Scan } from "./gql/graphql";
import { Grid } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";

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
}>`
  height: 100%;
  border: 2px solid black;
  aspect-ratio: 0.7225;
  max-height: 800px;

  display: flex;
  justify-content: center;
  align-items: center;

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
  group: Scan[];
  selectedScan: number | null;
  setSelectedScan: (id: number | null) => void;
}

export function CurrentGroup({
  group,
  selectedScan,
  setSelectedScan,
}: CurrentGroupProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      console.log("no wrapper");
      return;
    }

    const observer = new ResizeObserver(() => {
      wrapper.scrollLeft = wrapper.scrollWidth;
      console.log("resize observed");
    });

    observer.observe(wrapper);
    console.log("registering observer");

    return () => {
      observer.disconnect();
    };
  }, [wrapperRef]);

  return (
    <CurrentGroupWrapper>
      <PagesWrapper ref={wrapperRef}>
        {group.map((scan) => (
          <ScanWrapper
            key={scan.id}
            $selected={scan.id === selectedScan}
            $loading={scan.status === "PENDING"}
            $failed={scan.status === "FAILED"}
            onClick={() => {
              if (selectedScan === scan.id) {
                setSelectedScan(null);
              } else {
                setSelectedScan(scan.id!);
              }
            }}
          >
            {scan.status === "PENDING" && <Loader />}
            {scan.status === "FAILED" && <Error />}
            {scan.status === "COMPLETE" && <ScanImage src={scan.path} />}
          </ScanWrapper>
        ))}
      </PagesWrapper>
    </CurrentGroupWrapper>
  );
}
