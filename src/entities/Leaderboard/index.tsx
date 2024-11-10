// src/entities/leaderboard/ui/index.tsx
import { UserStats } from "../../common";
import { LeaderboardItem } from "./LeaderboardItem";
import { LeaderboardSection, LeaderboardTitle } from "./styles";

interface LeaderboardProps {
  userStats: UserStats[];
  currentUserId: string;
}

export const Leaderboard = ({ userStats, currentUserId }: LeaderboardProps) => (
  <LeaderboardSection>
    <LeaderboardTitle>Monthly Leaderboard</LeaderboardTitle>
    {userStats.map((stats) => (
      <LeaderboardItem
        key={stats.userId}
        userStats={stats}
        isCurrentUser={stats.userId === currentUserId}
      />
    ))}
  </LeaderboardSection>
);
