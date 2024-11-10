import { useState } from "react";
import { Login } from "../../auth";
import { WorkoutLogger } from "../../workout-logger";
import { DailyStatsLogger } from "../../stats-logger";
import { Dashboard } from "../../dashboard";
import { useAuth } from "../../auth";
import { WorkoutManager } from "../../workout-manager";
import {
  PortalContainer,
  Nav,
  NavList,
  NavItem,
  HomeLink,
  Content,
} from "./Portal.styles";

type View = "dashboard" | "workout-logger" | "stats-logger" | "workout-manager";

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
      case "workout-manager":
        return <WorkoutManager />;
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
              Log Activity
            </NavItem>
          </li>
          <li>
            <NavItem
              active={currentView === "workout-manager"}
              onClick={() => setCurrentView("workout-manager")}
            >
              Manage Activities
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
