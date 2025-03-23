import React from "react";
import styled from "styled-components";

const NavBarContainer = styled.div`
  display: flex;
  background-color: #333;
  padding: 10px;
  color: white;
`;

const NavButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? "#555" : "transparent")};
  color: white;
  border: none;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};

  &:hover {
    background-color: ${(props) => (props.active ? "#555" : "#444")};
  }
`;

interface NavigationBarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentRoute,
  onRouteChange,
}) => {
  return (
    <NavBarContainer>
      <NavButton
        active={currentRoute === "/"}
        onClick={() => onRouteChange("/")}
      >
        In-Progress Scans
      </NavButton>
      <NavButton
        active={currentRoute === "/finalized-groups"}
        onClick={() => onRouteChange("/finalized-groups")}
      >
        Finalized Groups
      </NavButton>
    </NavBarContainer>
  );
};
