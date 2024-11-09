// src/features/shared/utils/pointsCalculator.ts
import { WorkoutType } from "../../common";

export const basePointsMap: Record<WorkoutType, number> = {
  gym: 3,
  pilates: 3,
  sports: 3,
  swimming: 3,
  fitness_class: 3,
  yoga: 2,
  cycling: 2,
  running: 1,
  meditation: 3,
};

export const calculatePoints = (
  type: WorkoutType,
  duration: number
): number => {
  const basePoints = basePointsMap[type];
  const pointsForDuration = (basePoints * duration) / 30;
  return Number(pointsForDuration.toFixed(2));
};
