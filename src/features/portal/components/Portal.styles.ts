import styled from "@emotion/styled";

export const PortalContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Nav = styled.nav`
  background-color: #1a1a1a;
  padding: 1rem;
  position: relative;

  @media (max-width: 768px) {
    height: 3.5rem;
    display: flex;
    align-items: center;
    padding: 0;
  }
`;

export const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;

export const NavList = styled.ul<{ $isOpen: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${({ $isOpen }) => ($isOpen ? "0" : "-100%")};
    width: 75%;
    height: 100%;
    background-color: #1a1a1a;
    flex-direction: column;
    padding: 0;
    margin: 0;
    gap: 0;
    z-index: 999;
    transition: left 0.3s ease;
    overflow-y: auto;
    justify-content: flex-start;
    align-items: stretch;

    li {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    li:last-child {
      margin-top: auto;
      margin-bottom: 0;
    }
  }

  .sign-out-button {
    margin-left: auto;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
`;

export const MobileNavHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    height: 3.5rem;
    padding: 0 1rem;
    border-bottom: 1px solid #333;
    margin: 0;
    color: white;
    font-weight: bold;
    background-color: #1a1a1a;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  height: 3.5rem;
  width: 3.5rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

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

export const WorkoutPlanLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: block;
  width: 100%;
  font-size: inherit;
  background: transparent;
  transition: background-color 0.2s;
  text-align: left;

  &:hover {
    background-color: #333;
  }

  @media (min-width: 769px) {
    width: auto;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
`;

export const Content = styled.main`
  flex: 1;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;
