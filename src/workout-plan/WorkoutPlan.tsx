// src/components/WorkoutPlan.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import styled from "@emotion/styled";
import workoutData from "./workoutData.json";

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  rest?: string;
  duration?: string;
}

interface WorkoutPlan {
  muscle_groups: string[];
  exercises: Exercise[];
}

interface WorkoutData {
  weekly_workout_plan: {
    [key: string]: WorkoutPlan;
  };
}

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Picker = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const Workout = styled.div`
  margin-top: 20px;
`;

const Exercise = styled.div`
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const workoutDataTyped: WorkoutData = workoutData;

export const WorkoutPlan: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [plan, setPlan] = useState<WorkoutPlan>(
    workoutDataTyped.weekly_workout_plan["Monday"]
  );

  useEffect(() => {
    setPlan(workoutDataTyped.weekly_workout_plan[selectedDay]);
  }, [selectedDay]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(e.target.value);
  };

  return (
    <Container>
      <Picker value={selectedDay} onChange={handleChange}>
        {Object.keys(workoutDataTyped.weekly_workout_plan).map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </Picker>
      <Workout>
        <Title>{selectedDay}'s Workout</Title>
        <p>Muscle Groups: {plan.muscle_groups.join(", ")}</p>
        {plan.exercises.map((exercise, index) => (
          <Exercise key={index}>
            <strong>{exercise.name}</strong>
            {exercise.sets && (
              <p>
                Sets: {exercise.sets}, Reps: {exercise.reps}, Rest:{" "}
                {exercise.rest}
              </p>
            )}
            {exercise.duration && <p>Duration: {exercise.duration}</p>}
          </Exercise>
        ))}
      </Workout>
    </Container>
  );
};

export default WorkoutPlan;
