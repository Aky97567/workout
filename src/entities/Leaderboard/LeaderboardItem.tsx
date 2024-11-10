// src/entities/leaderboard/ui/LeaderboardItem.tsx
import { UserStats } from "../../common";
import {
  LeaderboardItem as StyledLeaderboardItem,
  UserInfo,
  UserName,
  Points,
  StatsInfo,
} from "./styles";

interface LeaderboardItemProps {
  userStats: UserStats;
  isCurrentUser: boolean;
}

export const LeaderboardItem = ({
  userStats,
  isCurrentUser,
}: LeaderboardItemProps) => (
  <StyledLeaderboardItem isCurrentUser={isCurrentUser}>
    <UserInfo>
      <UserName>{userStats.name}</UserName>
      <Points>{userStats.totalPoints.toLocaleString()} pts</Points>
    </UserInfo>
    <StatsInfo>Steps: {userStats.stepPoints.toLocaleString()} pts</StatsInfo>
    <StatsInfo>
      Activities: {userStats.workoutPoints.toLocaleString()} pts
      {` · ${userStats.workouts} workouts`}
    </StatsInfo>
    <StatsInfo>
      Habits: {userStats.habitPoints.toLocaleString()} pts
      {` · ${userStats.streak} day streak`}
    </StatsInfo>
  </StyledLeaderboardItem>
);
