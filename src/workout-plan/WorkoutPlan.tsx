import React, { useState, useEffect, ChangeEvent } from "react";
import workoutData from "./workoutData.json";
import {
  Container,
  Exercise,
  Picker,
  Title,
  Workout,
} from "./WorkoutPlan.styles";

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
      <Title>{selectedDay}'s Workout</Title>
      <span>Muscle Groups: {plan.muscle_groups.join(", ")}</span>
      <Workout>
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
