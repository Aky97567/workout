// src/entities/leaderboard/ui/styles.ts
import styled from "@emotion/styled";

export const LeaderboardSection = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

export const LeaderboardTitle = styled.h2`
  padding: 1rem;
  margin: 0;
  border-bottom: 1px solid #eee;
`;

export const LeaderboardItem = styled.div<{ isCurrentUser: boolean }>`
  padding: 1rem;
  background: ${(props) => (props.isCurrentUser ? "#e8f5e9" : "transparent")};

  @media (max-width: 500px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

export const UserName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

export const Points = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #4caf50;
`;

export const StatsInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
`;
