import styled from "styled-components";
import { ScanGroup } from "./gql/graphql";
import { Grid } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, MouseEvent } from "react";

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
  position: relative;

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
  user-select: none;
`;

const CropRegion = styled.div<{
  $left: number;
  $top: number;
  $width: number;
  $height: number;
}>`
  position: absolute;
  left: ${(props) => props.$left}px;
  top: ${(props) => props.$top}px;
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  border: 2px dashed #ff6600;
  background-color: rgba(255, 102, 0, 0.2);
  pointer-events: none;
  z-index: 10;
`;

// We need to create a container for the image and crop overlay that respects the rotation
const RotatedContent = styled.div<{ $rotation: number }>`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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

interface CropCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
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
  // Track if we're currently dragging
  const [isDragging, setIsDragging] = useState(false);
  // Track if we've moved the mouse during this drag operation
  const [hasDragged, setHasDragged] = useState(false);

  // Track crop coordinates during the drag operation and final selections
  const [activeCrop, setActiveCrop] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  // Store final crop selections for each scan
  const [cropCoordinates, setCropCoordinates] = useState<
    Record<number, CropCoordinates>
  >({});

  const imageRef = useRef<HTMLDivElement>(null);

  // Handle click on scan wrapper - only for selection, not for crop
  const handleScanWrapperClick = (scanId: number) => {
    // Only toggle selection if we didn't just complete a drag operation
    if (!hasDragged) {
      if (selectedScanId === scanId) {
        setSelectedScanId(null);
      } else {
        setSelectedScanId(scanId);
      }
    }

    // Reset the hasDragged flag
    setHasDragged(false);
  };

  // Start crop on mouse down
  const handleMouseDown = (e: MouseEvent, scanId: number) => {
    if (e.button !== 0) return; // Only proceed with left clicks

    // If the scan isn't selected yet, select it
    if (selectedScanId !== scanId) {
      setSelectedScanId(scanId);
      // Return early to allow selection to happen first
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Start new crop operation
    setActiveCrop({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });

    setHasDragged(false);
    setIsDragging(true);

    // Stop event propagation to prevent the ScanWrapper onClick from firing
    e.stopPropagation();
    e.preventDefault();
  };

  // Update crop as mouse moves
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !activeCrop) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    // If mouse has moved significantly, mark as dragged
    if (
      !hasDragged &&
      (Math.abs(x - activeCrop.startX) > 5 ||
        Math.abs(y - activeCrop.startY) > 5)
    ) {
      setHasDragged(true);
    }

    // Update the active crop with current mouse position
    setActiveCrop((prev) => ({
      ...prev!,
      endX: x,
      endY: y,
    }));

    e.stopPropagation();
    e.preventDefault();
  };

  // Finalize crop on mouse up
  const handleMouseUp = (e: MouseEvent, scanId: number) => {
    if (!isDragging || !activeCrop) return;

    const { startX, startY, endX, endY } = activeCrop;

    // Calculate the final crop coordinates
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    // Only save meaningful selections (not tiny accidental clicks)
    if (width > 10 && height > 10) {
      setCropCoordinates({
        ...cropCoordinates,
        [scanId]: { x, y, width, height },
      });
      // Ensure we mark this as a drag operation
      setHasDragged(true);
    }

    // End the crop operation
    setIsDragging(false);
    setActiveCrop(null);

    // Stop event propagation to prevent the ScanWrapper onClick from firing
    e.stopPropagation();
    e.preventDefault();
  };

  // Cancel crop if mouse leaves the image
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setActiveCrop(null);
    }
  };

  // Calculate the crop region display properties
  const calculateCropRegion = (scanId: number) => {
    // If we're actively dragging, show the active crop
    if (isDragging && activeCrop && scanId === selectedScanId) {
      return {
        left: Math.min(activeCrop.startX, activeCrop.endX),
        top: Math.min(activeCrop.startY, activeCrop.endY),
        width: Math.abs(activeCrop.endX - activeCrop.startX),
        height: Math.abs(activeCrop.endY - activeCrop.startY),
      };
    }

    // Otherwise show the saved crop if it exists
    if (cropCoordinates[scanId]) {
      const { x, y, width, height } = cropCoordinates[scanId];
      return { left: x, top: y, width, height };
    }

    return null;
  };

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
            onClick={() => handleScanWrapperClick(scan.id!)}
            ref={scan.id === selectedScanId ? imageRef : undefined}
          >
            {scan.status === "PENDING" && <Loader />}
            {scan.status === "FAILED" && <Error />}
            {scan.status === "COMPLETE" && (
              <RotatedContent $rotation={scan.rotation}>
                <ScanImage
                  src={scan.path}
                  onMouseDown={(e) => handleMouseDown(e, scan.id!)}
                  onMouseMove={
                    scan.id === selectedScanId ? handleMouseMove : undefined
                  }
                  onMouseUp={(e) => handleMouseUp(e, scan.id!)}
                  onMouseLeave={handleMouseLeave}
                />
                {/* Show crop region either from active dragging or saved coordinates */}
                {(isDragging || cropCoordinates[scan.id!]) &&
                  scan.id === selectedScanId &&
                  calculateCropRegion(scan.id!) && (
                    <CropRegion
                      $left={calculateCropRegion(scan.id!)!.left}
                      $top={calculateCropRegion(scan.id!)!.top}
                      $width={calculateCropRegion(scan.id!)!.width}
                      $height={calculateCropRegion(scan.id!)!.height}
                    />
                  )}
              </RotatedContent>
            )}
          </ScanWrapper>
        ))}
      </PagesWrapper>
    </CurrentGroupWrapper>
  );
}
