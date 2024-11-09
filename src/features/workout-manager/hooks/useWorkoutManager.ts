// src/features/workout-manager/hooks/useWorkoutManager.ts

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { calculatePoints, db } from "../../../shared";
import { WorkoutType } from "../../../common";

interface WorkoutLog {
  id: string;
  userId: string;
  type: WorkoutType;
  duration: number;
  points: number;
  date: Date | null;
  createdAt: Date;
}

interface FirestoreWorkoutLog {
  userId: string;
  type: WorkoutType;
  duration: number;
  points: number;
  date: Timestamp | null;
  createdAt: Timestamp;
}

export const useWorkoutManager = (currentUser: User | null) => {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutLog | null>(null);
  const [deletingWorkout, setDeletingWorkout] = useState<WorkoutLog | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    if (!currentUser) return;

    try {
      const workoutsRef = collection(
        db,
        "users",
        currentUser.uid,
        "workoutLogs"
      );
      const q = query(workoutsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedWorkouts: WorkoutLog[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreWorkoutLog;
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          duration: data.duration,
          points: data.points,
          date: data.date?.toDate() || null,
          createdAt: data.createdAt.toDate(),
        };
      });

      setWorkouts(fetchedWorkouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleEdit = (workout: WorkoutLog) => {
    setEditingWorkout(workout);
  };

  const handleUpdateWorkout = async (
    workoutId: string,
    updates: Partial<WorkoutLog>
  ) => {
    if (!currentUser) return;

    try {
      const workoutRef = doc(
        db,
        "users",
        currentUser.uid,
        "workoutLogs",
        workoutId
      );

      // If duration is being updated, recalculate points
      const updatedPoints =
        updates.duration !== undefined && editingWorkout
          ? calculatePoints(editingWorkout.type, updates.duration)
          : undefined;

      const updateData = {
        ...updates,
        points: updatedPoints,
        date: updates.date ? Timestamp.fromDate(updates.date) : null,
      };

      await updateDoc(workoutRef, updateData);

      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((w) =>
          w.id === workoutId
            ? {
                ...w,
                ...updates,
                points: updatedPoints ?? w.points,
              }
            : w
        )
      );

      setEditingWorkout(null);
      setIsDatePickerOpen(false);
    } catch (error) {
      console.error("Error updating workout:", error);
      throw new Error("Failed to update workout");
    }
  };

  const handleDelete = async (workoutId: string) => {
    if (!currentUser) return;

    try {
      const workoutRef = doc(
        db,
        "users",
        currentUser.uid,
        "workoutLogs",
        workoutId
      );

      await deleteDoc(workoutRef);
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((w) => w.id !== workoutId)
      );
      setDeletingWorkout(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
      throw new Error("Failed to delete workout");
    }
  };

  return {
    workouts,
    editingWorkout,
    deletingWorkout,
    isLoading,
    isDatePickerOpen,
    setEditingWorkout,
    setDeletingWorkout,
    setIsDatePickerOpen,
    handleEdit,
    handleUpdateWorkout,
    handleDelete,
  };
};
