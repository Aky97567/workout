// src/features/dashboard/hooks/useWeeklySteps.ts
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
} from "date-fns";
import { db } from "../../../shared";
import type { DailyStats } from "../types";

interface WeeklyStepsData {
  days: {
    date: string;
    dateDisplay: string;
    steps: number;
    userId: string;
    userName: string;
  }[];
  weekStart: Date;
  weekEnd: Date;
}

export const useWeeklySteps = (
  userStats: { userId: string; name: string }[]
) => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyStepsData | null>(null);

  useEffect(() => {
    const fetchWeeklySteps = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 0 }); // Sunday
        const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 0 });

        // Fetch daily stats for each user
        const allUserStepsPromises = userStats.map(async (user) => {
          const dailyStatsQuery = query(
            collection(db, "users", user.userId, "dailyStats"),
            where("date", ">=", format(weekStart, "yyyy-MM-dd")),
            where("date", "<=", format(weekEnd, "yyyy-MM-dd"))
          );

          const dailyStatsSnapshot = await getDocs(dailyStatsQuery);
          const dailyStats = dailyStatsSnapshot.docs.map(
            (doc) => doc.data() as DailyStats
          );

          // Create an entry for each day of the week
          return eachDayOfInterval({ start: weekStart, end: weekEnd }).map(
            (date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const dayStats = dailyStats.find((stat) => stat.date === dateStr);

              return {
                date: dateStr,
                dateDisplay: format(date, "EEE"), // Mon, Tue, etc.
                steps: dayStats?.steps || 0,
                userId: user.userId,
                userName: user.name,
              };
            }
          );
        });

        const allUserSteps = await Promise.all(allUserStepsPromises);

        setWeeklyData({
          days: allUserSteps.flat(),
          weekStart,
          weekEnd,
        });
      } catch (err) {
        console.error("Error fetching weekly steps:", err);
        setError("Failed to load weekly steps data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklySteps();
  }, [selectedWeek, userStats]);

  const nextWeek = () => setSelectedWeek((date) => addWeeks(date, 1));
  const previousWeek = () => setSelectedWeek((date) => subWeeks(date, 1));

  return {
    weeklyData,
    isLoading,
    error,
    nextWeek,
    previousWeek,
    selectedWeek,
  };
};
