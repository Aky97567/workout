// src/features/dashboard/hooks/useDashboardStats.ts
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { db } from "../../../shared";
import type { DashboardData, UserStats, MonthlyStats } from "../types";

export const useDashboardStats = (selectedDate: Date) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get start and end of selected month
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);

        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userStatsPromises = users.map(async (user) => {
          // Fetch daily stats for the month
          const dailyStatsQuery = query(
            collection(db, "users", user.id, "dailyStats"),
            where("date", ">=", format(monthStart, "yyyy-MM-dd")),
            where("date", "<=", format(monthEnd, "yyyy-MM-dd"))
          );
          const dailyStatsSnapshot = await getDocs(dailyStatsQuery);
          const dailyStats = dailyStatsSnapshot.docs.map((doc) => doc.data());

          // Fetch workout logs for the month
          const workoutLogsQuery = query(
            collection(db, "users", user.id, "workoutLogs"),
            where("date", ">=", monthStart),
            where("date", "<=", monthEnd)
          );
          const workoutLogsSnapshot = await getDocs(workoutLogsQuery);
          const workoutLogs = workoutLogsSnapshot.docs.map((doc) => doc.data());

          // Calculate points
          const stepPoints = dailyStats.reduce(
            (sum, stat) => sum + (stat.stepPoints || 0),
            0
          );
          const habitPoints = dailyStats.reduce(
            (sum, stat) =>
              sum +
              (stat.healthyHabits?.filter(
                (h: { completed: boolean }) => h.completed
              ).length || 0),
            0
          );
          const workoutPoints = workoutLogs.reduce(
            (sum, log) => sum + (log.points || 0),
            0
          );

          // Calculate streak points
          const streak = calculateStreak(dailyStats, workoutLogs);
          const streakPoints = calculateStreakPoints(streak);

          const userStats: UserStats = {
            userId: user.id,
            email: user.email,
            name: user.name || user.email,
            totalPoints:
              stepPoints + habitPoints + workoutPoints + streakPoints,
            stepPoints,
            workoutPoints,
            habitPoints,
            streakPoints,
            workouts: workoutLogs.length,
            steps: dailyStats.reduce((sum, stat) => sum + (stat.steps || 0), 0),
            habits: habitPoints,
            streak,
          };

          // Calculate daily points distribution
          const dailyPoints = eachDayOfInterval({
            start: monthStart,
            end: monthEnd,
          }).map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const dayStats = dailyStats.find((stat) => stat.date === dateStr);
            const dayWorkouts = workoutLogs.filter(
              (log) => format(log.date.toDate(), "yyyy-MM-dd") === dateStr
            );

            return {
              date: dateStr,
              points:
                (dayStats?.stepPoints || 0) +
                (dayStats?.healthyHabits?.filter((h) => h.completed).length ||
                  0) +
                dayWorkouts.reduce((sum, log) => sum + (log.points || 0), 0),
              stepPoints: dayStats?.stepPoints || 0,
              workoutPoints: dayWorkouts.reduce(
                (sum, log) => sum + (log.points || 0),
                0
              ),
              habitPoints:
                dayStats?.healthyHabits?.filter((h) => h.completed).length || 0,
            };
          });

          return {
            userStats,
            dailyPoints,
          };
        });

        const allUserStats = await Promise.all(userStatsPromises);

        const dashboardData: DashboardData = {
          userStats: allUserStats.map((stats) => stats.userStats),
          monthlyStats: {
            dailyPoints: allUserStats[0]?.dailyPoints || [],
            totalStats: {
              totalPoints: allUserStats.reduce(
                (sum, stats) => sum + stats.userStats.totalPoints,
                0
              ),
              stepPoints: allUserStats.reduce(
                (sum, stats) => sum + stats.userStats.stepPoints,
                0
              ),
              workoutPoints: allUserStats.reduce(
                (sum, stats) => sum + stats.userStats.workoutPoints,
                0
              ),
              habitPoints: allUserStats.reduce(
                (sum, stats) => sum + stats.userStats.habitPoints,
                0
              ),
              streakPoints: allUserStats.reduce(
                (sum, stats) => sum + stats.userStats.streakPoints,
                0
              ),
              workouts: allUserStats.reduce(
                (sum, stats) => sum + stats.userStats.workouts,
                0
              ),
              averageSteps:
                allUserStats.reduce(
                  (sum, stats) => sum + stats.userStats.steps,
                  0
                ) / (allUserStats.length || 1),
              habitCompletionRate:
                allUserStats.reduce(
                  (sum, stats) => sum + stats.userStats.habits,
                  0
                ) / (allUserStats.length * dailyPoints.length || 1),
            },
          },
        };

        setDashboardData(dashboardData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedDate]);

  return { dashboardData, isLoading, error };
};

const calculateStreak = (dailyStats: any[], workoutLogs: any[]): number => {
  // Consider a day active if there are either workouts or completed habits
  const activeDays = new Set([
    ...dailyStats
      .filter(
        (stat) =>
          stat.stepPoints > 0 ||
          stat.healthyHabits?.some((h: any) => h.completed)
      )
      .map((stat) => stat.date),
    ...workoutLogs.map((log) => format(log.date.toDate(), "yyyy-MM-dd")),
  ]);

  let currentStreak = 0;
  const today = new Date();
  const currentDate = today;

  while (activeDays.has(format(currentDate, "yyyy-MM-dd"))) {
    currentStreak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return currentStreak;
};

const calculateStreakPoints = (streak: number): number => {
  if (streak >= 14) return 10;
  if (streak >= 7) return 5;
  if (streak >= 3) return 2;
  return 0;
};

export const useMonthPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleMonthSelect = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    selectedDate,
    handleMonthSelect,
  };
};
