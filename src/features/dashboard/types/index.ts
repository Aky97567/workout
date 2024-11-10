// src/features/dashboard/types/index.ts

import { UserStats } from "../../../common";
import { calculateTotalStats } from "../../../shared";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface HealthyHabit {
  completed: boolean;
  name: string;
}

export interface DailyStats {
  date: string;
  steps: number;
  stepPoints: number;
  healthyHabits: HealthyHabit[];
}

export interface WorkoutLog {
  date: { toDate: () => Date };
  points: number;
}

export interface MonthlyStats {
  dailyPoints: {
    date: string;
    points: number;
    stepPoints: number;
    workoutPoints: number;
    habitPoints: number;
    userId: string;
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
  monthlyStats: {
    dailyPoints: {
      date: string;
      points: number;
      stepPoints: number;
      workoutPoints: number;
      habitPoints: number;
      userId: string;
    }[];
    totalStats: ReturnType<typeof calculateTotalStats>;
  };
  userDailyPoints: {
    [userId: string]: {
      date: string;
      points: number;
      stepPoints: number;
      workoutPoints: number;
      habitPoints: number;
      userId: string;
    }[];
  };
}

export type ChartTab = "points" | "activities" | "habits";
