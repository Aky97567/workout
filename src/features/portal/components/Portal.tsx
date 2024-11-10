import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Login } from "../../auth";
import { WorkoutLogger } from "../../workout-logger";
import { DailyStatsLogger } from "../../stats-logger";
import { Dashboard } from "../../dashboard";
import { useAuth } from "../../auth";
import { WorkoutManager } from "../../workout-manager";
import { WorkoutPlan } from "../../workout-plan";
import {
  PortalContainer,
  Nav,
  NavList,
  NavItem,
  Content,
  MobileMenuButton,
  MobileOverlay,
  MobileNavHeader,
} from "./Portal.styles";

type View =
  | "workout-plan"
  | "dashboard"
  | "workout-logger"
  | "stats-logger"
  | "workout-manager"; // Added workout-plan

export const Portal = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case "workout-plan":
        return <WorkoutPlan />;
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <PortalContainer>
      <Nav>
        <MobileMenuButton onClick={toggleMobileMenu}>
          <Menu size={24} />
        </MobileMenuButton>
        <MobileOverlay
          $isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <NavList $isOpen={isMobileMenuOpen}>
          <MobileNavHeader>
            <X
              size={24}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ marginRight: "0.5rem", cursor: "pointer" }}
            />
            Menu
          </MobileNavHeader>
          <li>
            <NavItem
              active={currentView === "workout-plan"}
              onClick={() => handleNavClick("workout-plan")}
            >
              Workout Plan
            </NavItem>
          </li>
          <li>
            <NavItem
              active={currentView === "dashboard"}
              onClick={() => handleNavClick("dashboard")}
            >
              Dashboard
            </NavItem>
          </li>
          <li>
            <NavItem
              active={currentView === "workout-logger"}
              onClick={() => handleNavClick("workout-logger")}
            >
              Log Activity
            </NavItem>
          </li>
          <li>
            <NavItem
              active={currentView === "workout-manager"}
              onClick={() => handleNavClick("workout-manager")}
            >
              Manage Activities
            </NavItem>
          </li>
          <li>
            <NavItem
              active={currentView === "stats-logger"}
              onClick={() => handleNavClick("stats-logger")}
            >
              Daily Stats
            </NavItem>
          </li>
          <li>
            <NavItem
              active={false}
              onClick={handleSignOut}
              className="sign-out-button"
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
