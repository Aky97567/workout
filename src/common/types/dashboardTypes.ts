import { calculateTotalStats } from "../../shared";
import { UserStats } from "./fitnessTypes";

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
    }[];
  };
}

export interface WeeklyStepData {
  date: string;
  dateDisplay: string; // e.g., "Mon", "Tue"
  steps: number;
  userId: string;
  userName: string;
}

export interface WeeklyChartProps {
  data: WeeklyStepData[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  selectedWeek: Date;
}
