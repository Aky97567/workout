import { Trophy, Medal } from "lucide-react";
import {
  WinnerCard,
  CardHeader,
  Title,
  CardContent,
  IconContainer,
  WinnerInfo,
  WinnerName,
  ScoreText,
  DifferenceText,
  TrophyContainer,
} from "./MonthlyWinner.styles";
import { MonthlyWinnerProps, MonthMetrics } from "./MonthlyWinner.types";
import trophyImage from "./assets/elegant-trophy.webp";
import trophyImage2 from "./assets/winner-gold.png";
import trophyImage3 from "./assets/award-winner.png";
import trophyImage4 from "./assets/gold-winner-trophy-icon.webp";
import trophyImage5 from "./assets/winner-yellow.png";
import { useEffect, useState } from "react";

export const MonthlyWinner = ({
  monthData,
  currentUser,
  competitorUser,
}: MonthlyWinnerProps) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const [mod, setMod] = useState(parseInt(monthData.month) % 6);

  useEffect(() => {
    const month = parseInt(monthData.month.split("-")[1]);
    setMod(month % 6);
  }, [monthData.month]);
  console.log(mod);

  const isMonthInPast = (monthStr: string) => {
    const [year, month] = monthStr.split("-").map((num) => parseInt(num));
    const isPast =
      year < currentYear || (year === currentYear && month < currentMonth);
    return isPast;
  };

  if (!isMonthInPast(monthData.month)) {
    return null;
  }

  const calculateWinner = (metrics: MonthMetrics) => {
    if (!metrics?.users) return null;

    const userScore = metrics.users[currentUser.uid]?.totalPoints || 0;
    const competitorScore = metrics.users[competitorUser.uid]?.totalPoints || 0;

    if (userScore === competitorScore) return null;
    return {
      winner: userScore > competitorScore ? currentUser : competitorUser,
      score: Math.max(userScore, competitorScore),
      difference: Math.abs(userScore - competitorScore),
    };
  };

  if (!isMonthInPast(monthData.month)) {
    return null;
  }

  const winnerInfo = calculateWinner(monthData.metrics);

  if (!winnerInfo) {
    return null;
  }

  const monthDate = new Date(monthData.month + "-01");
  const monthLabel = monthDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <WinnerCard>
      <CardHeader>
        <Title>{monthLabel} Champion</Title>
      </CardHeader>
      <CardContent>
        <TrophyContainer>
          {mod == 0 && (
            <IconContainer>
              <Trophy size={48} color="#EAB308" />
              <Medal
                size={24}
                color="#3B82F6"
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                }}
              />
            </IconContainer>
          )}
          {mod == 1 && (
            <img
              src={trophyImage}
              alt="Trophy"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
              }}
            />
          )}
          {mod == 2 && (
            <img
              src={trophyImage2}
              alt="Trophy"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
              }}
            />
          )}
          {mod == 3 && (
            <img
              src={trophyImage3}
              alt="Trophy"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
              }}
            />
          )}
          {mod == 4 && (
            <img
              src={trophyImage4}
              alt="Trophy"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
              }}
            />
          )}
          {mod == 5 && (
            <img
              src={trophyImage5}
              alt="Trophy"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
              }}
            />
          )}
        </TrophyContainer>
        <WinnerInfo>
          <WinnerName>{winnerInfo.winner.name}</WinnerName>
          <ScoreText>Score: {winnerInfo.score.toLocaleString()}</ScoreText>
          <DifferenceText>
            Won by {winnerInfo.difference.toLocaleString()} points
          </DifferenceText>
        </WinnerInfo>
      </CardContent>
    </WinnerCard>
  );
};
