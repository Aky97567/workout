export interface WorkoutLog {
  id?: string;
  userId: string;
  date: Date;
  type: WorkoutType;
  duration: number;
  points: number;
}

export type WorkoutType =
  | "gym"
  | "pilates"
  | "sports"
  | "swimming"
  | "fitness_class"
  | "yoga"
  | "cycling"
  | "running";

export interface DailyStats {
  id?: string;
  userId: string;
  date: string; // Format: 'YYYY-MM-DD'
  steps: number;
  stepPoints: number;
  healthyHabits: HealthyHabit[];
}

export interface MonthlyStats {
  id?: string;
  userId: string;
  month: string; // Format: 'YYYY-MM'
  totalPoints: number;
  workoutStreak: number;
  monthlyWorkouts: number;
  lastWorkoutDate?: Date;
  achievements: Achievement[];
  totalSteps: number;
}

export interface Achievement {
  type:
    | "new_workout"
    | "monthly_steps"
    | "twenty_workouts"
    | "personal_record"
    | "streak_3day"
    | "streak_7day"
    | "streak_14day";
  date: Date;
  points: number;
}

export interface HealthyHabit {
  type: "meals" | "water" | "sleep";
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  monthlyStepGoal: number;
}
