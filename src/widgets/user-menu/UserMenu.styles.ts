// src/widgets/user-menu/ui/UserMenu.styles.tsx
import styled from "@emotion/styled";

export const UserMenuContainer = styled.div`
  position: relative;

  @media (min-width: 769px) {
    margin-left: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem; // Match NavItem padding
  border-radius: 4px;
  transition: background-color 0.2s;
  height: 100%; // Ensure consistent height
  font-size: inherit; // Match other nav items' font size
  height: 38px;
  line-height: 1;

  &:hover {
    background-color: #333;
  }

  span {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  width: 200px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

export const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #333;

  .name {
    font-weight: bold;
    color: white;
    margin-bottom: 0.25rem;
  }

  .email {
    font-size: 0.875rem;
    color: #999;
  }
`;

export const UserMenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333;
  }
`;

// src/features/portal/Portal.styles.tsx
export const NavItem = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? "#4a4a4a" : "transparent")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  text-align: left;
  font-size: inherit;
  display: flex;
  align-items: center; // This will vertically center the content

  &:hover {
    background-color: #333;
  }

  @media (min-width: 769px) {
    width: auto;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 0;
    width: 100%;
    justify-content: flex-start;
  }
`;

export const MobileOnlyNavItem = styled(NavItem)`
  @media (min-width: 769px) {
    display: none;
  }
`;
