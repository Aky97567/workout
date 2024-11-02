import { useState } from "react";
import styled from "@emotion/styled";
import { Login } from "../../auth";
import { WorkoutLogger } from "../../workout-logger";
import { DailyStatsLogger } from "../../stats-logger";
import { Dashboard } from "../../dashboard/Dashboard";
import { useAuth } from "../../auth";

type View = "dashboard" | "workout-logger" | "stats-logger";

const PortalContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Nav = styled.nav`
  background-color: #1a1a1a;
  padding: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const NavItem = styled.button<{ active: boolean }>`
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

const Content = styled.main`
  flex: 1;
  padding: 1rem;
`;

const HomeLink = styled.a`
  text-decoration: none;
  padding: 0.5rem 1rem;
  position: absolute;
  left: 1rem;
  top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const Portal = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const { currentUser, signOut } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "workout-logger":
        return <WorkoutLogger />;
      case "stats-logger":
        return <DailyStatsLogger />;
      default:
        return <Dashboard />;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <PortalContainer>
      <Nav>
        <HomeLink href="/workout/">Workout Plan</HomeLink>
        <NavList>
          <li>
            <NavItem
              active={currentView === "dashboard"}
              onClick={() => setCurrentView("dashboard")}
            >
              Dashboard
            </NavItem>
          </li>
          <li>
            <NavItem
              active={currentView === "workout-logger"}
              onClick={() => setCurrentView("workout-logger")}
            >
              Log Workout
            </NavItem>
          </li>
          <li>
            <NavItem
              active={currentView === "stats-logger"}
              onClick={() => setCurrentView("stats-logger")}
            >
              Daily Stats
            </NavItem>
          </li>
          <li>
            <NavItem
              active={false}
              onClick={handleSignOut}
              style={{ marginLeft: "auto" }}
            >
              Sign Out
            </NavItem>
          </li>
        </NavList>
      </Nav>
      <Content>{renderView()}</Content>
    </PortalContainer>
  );
};
