import styled from "@emotion/styled";

export const PortalContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Nav = styled.nav`
  background-color: #1a1a1a;
  padding: 1rem;
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const NavItem = styled.button<{ active: boolean }>`
  background: ${(props) => (props.active ? "#4a4a4a" : "transparent")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333;
  }
`;

export const Content = styled.main`
  flex: 1;
  padding: 1rem;
`;

export const HomeLink = styled.a`
  text-decoration: none;
  padding: 0.5rem 1rem;
  position: absolute;
  left: 1rem;
  top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;
