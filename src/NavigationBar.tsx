import React from "react";
import styled from "styled-components";

const NavContainer = styled.nav`
  display: flex;
  background-color: #343a40;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled.div<{ active: boolean }>`
  padding: 16px 24px;
  color: ${(props) => (props.active ? "white" : "#a8a9a9")};
  cursor: pointer;
  font-weight: bold;
  position: relative;

  &:hover {
    color: white;
  }

  ${(props) =>
    props.active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: #007bff;
    }
  `}
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
    <NavContainer>
      <NavItem active={currentRoute === "/"} onClick={() => onRouteChange("/")}>
        Scan
      </NavItem>
      <NavItem
        active={currentRoute === "/edit"}
        onClick={() => onRouteChange("/edit")}
      >
        Edit
      </NavItem>
      <NavItem
        active={currentRoute === "/export"}
        onClick={() => onRouteChange("/export")}
      >
        Export
      </NavItem>
    </NavContainer>
  );
};
