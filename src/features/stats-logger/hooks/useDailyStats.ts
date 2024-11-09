// src/features/daily-stats/hooks/useDailyStats.ts
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../shared";
import { startOfDay, format } from "date-fns";
import type { DailyStats, HealthyHabit } from "../../../common";

export const useDailyStats = (
  userId: string | undefined,
  selectedDate: Date
) => {
  const [steps, setSteps] = useState<number>(0);
  const [habits, setHabits] = useState<HealthyHabit[]>([
    { type: "meals", completed: false },
    { type: "water", completed: false },
    { type: "sleep", completed: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Normalize date to start of day and get consistent date string
  const normalizedDate = startOfDay(selectedDate);
  const dateString = format(normalizedDate, "yyyy-MM-dd");

  useEffect(() => {
    if (!userId) return;

    const loadDailyStats = async () => {
      setIsLoading(true);
      try {
        const userDailyStatsRef = doc(
          db,
          "users",
          userId,
          "dailyStats",
          dateString
        );
        const docSnap = await getDoc(userDailyStatsRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as DailyStats;
          setSteps(data.steps);
          setHabits(data.healthyHabits);
        } else {
          // Reset for new date
          setSteps(0);
          setHabits([
            { type: "meals", completed: false },
            { type: "water", completed: false },
            { type: "sleep", completed: false },
          ]);
        }
      } catch (error) {
        console.error("Error loading daily stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyStats();
  }, [userId, dateString]);

  const saveDailyStats = async () => {
    if (!userId) return;

    setIsSaving(true);
    const stepPoints = calculateStepPoints(steps);
    const statsDoc: DailyStats = {
      userId,
      date: dateString,
      steps,
      stepPoints,
      healthyHabits: habits,
    };

    try {
      const userDailyStatsRef = doc(
        db,
        "users",
        userId,
        "dailyStats",
        dateString
      );
      await setDoc(userDailyStatsRef, statsDoc);
      return true;
    } catch (error) {
      console.error("Error updating daily stats:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleHabitToggle = (habitType: "meals" | "water" | "sleep") => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.type === habitType
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  return {
    steps,
    setSteps,
    habits,
    handleHabitToggle,
    isLoading,
    isSaving,
    saveDailyStats,
    isDatePickerOpen,
    setIsDatePickerOpen,
  };
};

const calculateStepPoints = (steps: number): number => {
  const points = steps / 1000;
  return Number(points.toFixed(3));
};
