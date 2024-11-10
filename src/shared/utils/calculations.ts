// src/features/dashboard/utils/calculations.ts
import { format } from "date-fns";
import type {
  DailyStats,
  WorkoutLog,
  UserStats,
  HealthyHabit,
} from "../../common";

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

export const calculateStreak = (
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
    ...workoutLogs.map((log) => {
      const date = isFirestoreTimestamp(log.date)
        ? log.date.toDate()
        : log.date;
      return format(date, "yyyy-MM-dd");
    }),
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

export const calculateStreakPoints = (streak: number): number => {
  if (streak >= 14) return 10;
  if (streak >= 7) return 5;
  if (streak >= 3) return 2;
  return 0;
};

export const calculateUserStats = (
  userId: string,
  email: string,
  name: string,
  dailyStats: DailyStats[],
  workoutLogs: WorkoutLog[]
): UserStats => {
  const stepPoints = dailyStats.reduce(
    (sum: number, stat) => sum + (stat.stepPoints || 0),
    0
  );

  const habitPoints = dailyStats.reduce(
    (sum: number, stat) =>
      sum +
      (stat.healthyHabits?.filter((h: HealthyHabit) => h.completed).length ||
        0),
    0
  );

  const workoutPoints = workoutLogs.reduce(
    (sum: number, log) => sum + (log.points || 0),
    0
  );

  const streak = calculateStreak(dailyStats, workoutLogs);
  const streakPoints = calculateStreakPoints(streak);

  return {
    userId,
    email,
    name,
    totalPoints: stepPoints + habitPoints + workoutPoints + streakPoints,
    stepPoints,
    workoutPoints,
    habitPoints,
    streakPoints,
    workouts: workoutLogs.length,
    steps: dailyStats.reduce((sum: number, stat) => sum + (stat.steps || 0), 0),
    habits: habitPoints,
    streak,
  };
};

export const calculateTotalStats = (userStats: UserStats[]) => {
  return {
    totalPoints: userStats.reduce((sum, stats) => sum + stats.totalPoints, 0),
    stepPoints: userStats.reduce((sum, stats) => sum + stats.stepPoints, 0),
    workoutPoints: userStats.reduce(
      (sum, stats) => sum + stats.workoutPoints,
      0
    ),
    habitPoints: userStats.reduce((sum, stats) => sum + stats.habitPoints, 0),
    streakPoints: userStats.reduce((sum, stats) => sum + stats.streakPoints, 0),
    workouts: userStats.reduce((sum, stats) => sum + stats.workouts, 0),
    averageSteps:
      userStats.reduce((sum, stats) => sum + stats.steps, 0) /
      (userStats.length || 1),
    habitCompletionRate:
      userStats.reduce((sum, stats) => sum + stats.habits, 0) /
      (userStats.length || 1),
  };
};
