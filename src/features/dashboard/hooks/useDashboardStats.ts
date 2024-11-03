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
import type {
  DashboardData,
  UserStats,
  DailyStats,
  WorkoutLog,
} from "../types";
import { getAuth } from "@firebase/auth";

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
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid;
        console.log("Current user:", currentUserId);

        if (!currentUserId) {
          throw new Error("No authenticated user");
        }

        // Get the list of users from userList document
        const userListDoc = await getDoc(doc(db, "userList", "all"));
        if (!userListDoc.exists()) {
          throw new Error("User list not found");
        }

        const usersRaw = userListDoc.data().users as {
          id: string;
          name: string;
        }[];
        console.log("Found user IDs:", usersRaw);

        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        console.log("Fetching data for:", {
          monthStart: format(monthStart, "yyyy-MM-dd"),
          monthEnd: format(monthEnd, "yyyy-MM-dd"),
        });

        // Create user objects
        const users = usersRaw.map((user) => ({
          id: user.id,
          email:
            user.id === currentUserId ? auth.currentUser?.email || "" : user.id,
          name: user.name ? user.name || "" : user.id,
        }));

        const userStatsPromises = users.map(async (user) => {
          // Fetch daily stats for the month
          console.log("User ID type:", typeof user.id); // Should log "string"
          console.log("User ID :", user.id);
          const dailyStatsQuery = query(
            collection(db, "users", user.id, "dailyStats"),
            where("date", ">=", format(monthStart, "yyyy-MM-dd")),
            where("date", "<=", format(monthEnd, "yyyy-MM-dd"))
          );
          const dailyStatsSnapshot = await getDocs(dailyStatsQuery);
          const dailyStats = dailyStatsSnapshot.docs.map(
            (doc) => doc.data() as DailyStats
          );
          console.log(`Daily stats for user ${user.id}:`, dailyStats);

          // Fetch workout logs for the month
          const workoutLogsQuery = query(
            collection(db, "users", user.id, "workoutLogs"),
            where("date", ">=", monthStart),
            where("date", "<=", monthEnd)
          );
          const workoutLogsSnapshot = await getDocs(workoutLogsQuery);
          const workoutLogs = workoutLogsSnapshot.docs.map(
            (doc) => doc.data() as WorkoutLog
          );
          console.log(`Workout logs for user ${user.id}:`, workoutLogs);

          // Calculate points
          const stepPoints = dailyStats.reduce(
            (sum: number, stat) => sum + (stat.stepPoints || 0),
            0
          );
          const habitPoints = dailyStats.reduce(
            (sum: number, stat) =>
              sum +
              (stat.healthyHabits?.filter((h) => h.completed).length || 0),
            0
          );
          const workoutPoints = workoutLogs.reduce(
            (sum: number, log) => sum + (log.points || 0),
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
            steps: dailyStats.reduce(
              (sum: number, stat) => sum + (stat.steps || 0),
              0
            ),
            habits: habitPoints,
            streak,
          };

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
                dayWorkouts.reduce(
                  (sum: number, log) => sum + (log.points || 0),
                  0
                ),
              stepPoints: dayStats?.stepPoints || 0,
              workoutPoints: dayWorkouts.reduce(
                (sum: number, log) => sum + (log.points || 0),
                0
              ),
              habitPoints:
                dayStats?.healthyHabits?.filter((h) => h.completed).length || 0,
              userId: user.id,
            };
          });

          return {
            userStats,
            dailyPoints,
          };
        });

        const allUserStats = await Promise.all(userStatsPromises);

        // Create userDailyPoints map
        const userDailyPoints: DashboardData["userDailyPoints"] = {};
        allUserStats.forEach((stats) => {
          userDailyPoints[stats.userStats.userId] = stats.dailyPoints;
        });

        // Combine all daily points for the overview
        const allDailyPoints = allUserStats.flatMap(
          (stats) => stats.dailyPoints
        );

        const dashboardData: DashboardData = {
          userStats: allUserStats.map((stats) => stats.userStats),
          userDailyPoints,
          monthlyStats: {
            dailyPoints: allDailyPoints,
            totalStats: {
              totalPoints: allUserStats.reduce(
                (sum: number, stats) => sum + stats.userStats.totalPoints,
                0
              ),
              stepPoints: allUserStats.reduce(
                (sum: number, stats) => sum + stats.userStats.stepPoints,
                0
              ),
              workoutPoints: allUserStats.reduce(
                (sum: number, stats) => sum + stats.userStats.workoutPoints,
                0
              ),
              habitPoints: allUserStats.reduce(
                (sum: number, stats) => sum + stats.userStats.habitPoints,
                0
              ),
              streakPoints: allUserStats.reduce(
                (sum: number, stats) => sum + stats.userStats.streakPoints,
                0
              ),
              workouts: allUserStats.reduce(
                (sum: number, stats) => sum + stats.userStats.workouts,
                0
              ),
              averageSteps:
                allUserStats.reduce(
                  (sum: number, stats) => sum + stats.userStats.steps,
                  0
                ) / (allUserStats.length || 1),
              habitCompletionRate:
                allUserStats.reduce(
                  (sum: number, stats) => sum + stats.userStats.habits,
                  0
                ) /
                (allUserStats.length * allUserStats[0]?.dailyPoints.length ||
                  1),
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

const calculateStreak = (
  dailyStats: DailyStats[],
  workoutLogs: WorkoutLog[]
): number => {
  const activeDays = new Set([
    ...dailyStats
      .filter(
        (stat) =>
          stat.stepPoints > 0 || stat.healthyHabits?.some((h) => h.completed)
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
