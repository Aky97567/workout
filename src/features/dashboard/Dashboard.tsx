import styled from "@emotion/styled";
import { useAuth } from "../auth";

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Placeholder = styled.div`
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
`;

export const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <DashboardContainer>
      <Header>
        <h1>Welcome, {currentUser?.email}</h1>
      </Header>
      <Placeholder>Dashboard content coming soon...</Placeholder>
    </DashboardContainer>
  );
};
