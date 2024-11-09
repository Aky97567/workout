// src/features/workout-manager/types.ts
import { WorkoutType } from "../../common";

export interface WorkoutLog {
  id: string;
  userId: string;
  type: WorkoutType;
  duration: number;
  points: number;
  date?: Date;
  createdAt: Date;
}

export interface EditingWorkout extends Omit<WorkoutLog, "date" | "createdAt"> {
  date: Date | null;
  createdAt: Date;
}
