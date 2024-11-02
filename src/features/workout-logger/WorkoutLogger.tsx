// src/features/workout-logger/components/WorkoutLogger.tsx
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../shared/config";
import { WorkoutType } from "../../common";
import { useAuth } from "../auth";
import styled from "@emotion/styled";

const LoggerContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const workoutTypes: Record<WorkoutType, string> = {
  gym: "Gym Session",
  home: "Home Workout",
  sports: "Sports Game/Match",
  swimming: "Swimming Session",
  fitness_class: "Fitness Class",
  yoga_pilates: "Yoga/Pilates",
};

export const WorkoutLogger = () => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>("gym");
  const [duration, setDuration] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const calculatePoints = (type: WorkoutType, duration: number): number => {
    if (duration < 30) return 0;

    const pointsMap: Record<WorkoutType, number> = {
      gym: 3,
      home: 2,
      sports: 3,
      swimming: 3,
      fitness_class: 3,
      yoga_pilates: 2,
    };

    return pointsMap[type];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    setIsLoading(true);

    const points = calculatePoints(workoutType, duration);

    const workoutLog = {
      userId: currentUser.uid,
      date: new Date(),
      type: workoutType,
      duration,
      points,
      createdAt: new Date(),
    };

    try {
      const userWorkoutLogsRef = collection(
        db,
        "users",
        currentUser.uid,
        "workoutLogs"
      );
      await addDoc(userWorkoutLogsRef, workoutLog);
      alert("Workout logged successfully!");
      setDuration(30);
    } catch (error) {
      console.error("Error logging workout:", error);
      alert("Error logging workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Please log in to log workouts</div>;
  }

  return (
    <LoggerContainer>
      <h2>Log Your Workout</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Workout Type</Label>
          <Select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
          >
            {Object.entries(workoutTypes).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            min="0"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </FormGroup>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Logging..." : "Log Workout"}
        </Button>
      </Form>
    </LoggerContainer>
  );
};
