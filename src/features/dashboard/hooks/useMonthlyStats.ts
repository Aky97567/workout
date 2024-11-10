// src/features/dashboard/hooks/useMonthlyStats.ts
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { db } from "../../../shared";
import { User, DailyStats, WorkoutLog, UserStats } from "../../../common";
import { calculateUserStats } from "../../../shared";

interface DailyPoint {
  date: string;
  points: number;
  stepPoints: number;
  workoutPoints: number;
  habitPoints: number;
  userId: string; // Added userId
}

interface FirestoreTimestamp {
  toDate: () => Date;
  seconds: number; // Firestore timestamps always have these properties
  nanoseconds: number;
}

type DateOrTimestamp = Date | FirestoreTimestamp;

const isFirestoreTimestamp = (
  date: DateOrTimestamp
): date is FirestoreTimestamp => {
  return "seconds" in date && "nanoseconds" in date;
};

export const useMonthlyStats = (users: User[], selectedDate: Date) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<{
    userStats: UserStats[];
    userDailyPoints: {
      [userId: string]: DailyPoint[];
    };
  } | null>(null);

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);

        const userStatsPromises = users.map(async (user) => {
          // Fetch daily stats
          const dailyStatsQuery = query(
            collection(db, "users", user.id, "dailyStats"),
            where("date", ">=", format(monthStart, "yyyy-MM-dd")),
            where("date", "<=", format(monthEnd, "yyyy-MM-dd"))
          );
          const dailyStatsSnapshot = await getDocs(dailyStatsQuery);
          const dailyStats = dailyStatsSnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                userId: user.id, // Ensure userId is included
              } as DailyStats)
          );

          // Fetch workout logs
          const workoutLogsQuery = query(
            collection(db, "users", user.id, "workoutLogs"),
            where("date", ">=", monthStart),
            where("date", "<=", monthEnd)
          );
          const workoutLogsSnapshot = await getDocs(workoutLogsQuery);
          const workoutLogs = workoutLogsSnapshot.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                userId: user.id, // Ensure userId is included
              } as WorkoutLog)
          );

          // Calculate user stats
          const userStats = calculateUserStats(
            user.id,
            user.email,
            user.name,
            dailyStats,
            workoutLogs
          );

          // Calculate daily points for each day in the month
          const dailyPoints = eachDayOfInterval({
            start: monthStart,
            end: monthEnd,
          }).map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const dayStats = dailyStats.find((stat) => stat.date === dateStr);
            const dayWorkouts = workoutLogs.filter((log) => {
              const workoutDate = isFirestoreTimestamp(log.date)
                ? log.date.toDate()
                : log.date;
              return format(workoutDate, "yyyy-MM-dd") === dateStr;
            });

            return {
              date: dateStr,
              stepPoints: dayStats?.stepPoints || 0,
              workoutPoints: dayWorkouts.reduce(
                (sum: number, log) => sum + (log.points || 0),
                0
              ),
              habitPoints:
                dayStats?.healthyHabits?.filter((h) => h.completed).length || 0,
              points:
                (dayStats?.stepPoints || 0) +
                (dayStats?.healthyHabits?.filter((h) => h.completed).length ||
                  0) +
                dayWorkouts.reduce(
                  (sum: number, log) => sum + (log.points || 0),
                  0
                ),
              userId: user.id,
            };
          });

          return {
            userStats,
            dailyPoints,
          };
        });

        const results = await Promise.all(userStatsPromises);

        const userDailyPoints: {
          [userId: string]: (typeof results)[0]["dailyPoints"];
        } = {};

        results.forEach((result) => {
          userDailyPoints[result.userStats.userId] = result.dailyPoints;
        });

        setMonthlyData({
          userStats: results.map((r) => r.userStats),
          userDailyPoints,
        });
      } catch (err) {
        console.error("Error fetching monthly stats:", err);
        setError("Failed to load monthly statistics");
      } finally {
        setIsLoading(false);
      }
    };

    if (users.length > 0) {
      fetchMonthlyStats();
    }
  }, [users, selectedDate]);

  return { monthlyData, isLoading, error };
};
