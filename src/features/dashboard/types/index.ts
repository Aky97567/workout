// src/features/dashboard/types/index.ts
export interface UserStats {
  userId: string;
  email: string;
  name: string;
  totalPoints: number;
  stepPoints: number;
  workoutPoints: number;
  habitPoints: number;
  streakPoints: number;
  workouts: number;
  steps: number;
  habits: number;
  streak: number;
}

export interface MonthlyStats {
  dailyPoints: {
    date: string;
    points: number;
    stepPoints: number;
    workoutPoints: number;
    habitPoints: number;
  }[];
  totalStats: {
    totalPoints: number;
    stepPoints: number;
    workoutPoints: number;
    habitPoints: number;
    streakPoints: number;
    workouts: number;
    averageSteps: number;
    habitCompletionRate: number;
  };
}

export interface DashboardData {
  userStats: UserStats[];
  monthlyStats: MonthlyStats;
}

export type ChartTab = "points" | "activities" | "habits";
