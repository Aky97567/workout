// src/features/dashboard/styles/Dashboard.styles.ts
import styled from "@emotion/styled";

export const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.header`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DatePickerWrapper = styled.div`
  position: relative;
`;

export const MonthPickerButton = styled.button`
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #f5f5f5;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const StatsCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StatsCardTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
`;

export const ChartContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  height: 400px;
`;

export const LeaderboardContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const LeaderboardTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #333;
`;

export const LeaderboardItem = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: ${(props) => (props.isCurrentUser ? "#e8f5e9" : "transparent")};
  border-radius: 4px;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.div`
  font-weight: bold;
  color: #333;
`;

export const UserStats = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

export const Points = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #4caf50;
`;

export const MonthPickerContainer = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1rem;
`;

export const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
`;

export const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

export const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

export const TabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${(props) => (props.active ? "#4caf50" : "#f5f5f5")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.active ? "#45a049" : "#e0e0e0")};
  }
`;
