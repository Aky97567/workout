import React, { useState, useEffect, ChangeEvent } from "react";
import workoutData from "./workoutData.json";
import {
  Container,
  Exercise,
  ExerciseTitle,
  Picker,
  Workout,
  Image,
  MuscleGroup,
} from "./WorkoutPlan.styles";
import { exerciseImages } from "./images";
import { useWindowHeight } from "../hooks";

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  rest?: string;
  duration?: string;
  imageKey?: string;
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
  const [plan, setPlan] = useState<WorkoutPlan | null>(
    workoutDataTyped.weekly_workout_plan["Monday"] || null
  );
  const [visibleImages, setVisibleImages] = useState<{
    [key: number]: boolean;
  }>({});

  const viewHeight = useWindowHeight();

  useEffect(() => {
    const newPlan = workoutDataTyped.weekly_workout_plan[selectedDay];
    setPlan(newPlan ? newPlan : null);
    setVisibleImages({}); // Reset visible images when the day changes
  }, [selectedDay]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(e.target.value);
  };

  const toggleImageVisibility = (index: number) => {
    setVisibleImages((prevVisibleImages) => ({
      ...prevVisibleImages,
      [index]: !prevVisibleImages[index],
    }));
  };

  return (
    <Container height={viewHeight}>
      <Picker value={selectedDay} onChange={handleChange}>
        {Object.keys(workoutDataTyped.weekly_workout_plan).map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </Picker>
      <br />
      {plan ? (
        <>
          <MuscleGroup>{plan.muscle_groups.join(", ")}</MuscleGroup>
          <Workout>
            {plan.exercises.map((exercise, index) => (
              <Exercise
                key={index}
                onClick={() => toggleImageVisibility(index)}
              >
                <ExerciseTitle needPadding={!exercise.sets}>
                  {exercise.name}
                </ExerciseTitle>
                {exercise.sets && (
                  <p>
                    Sets: {exercise.sets}, Reps: {exercise.reps}, Rest:{" "}
                    {exercise.rest}
                  </p>
                )}
                {exercise.duration && <p>Duration: {exercise.duration}</p>}
                {visibleImages[index] &&
                  exercise.imageKey &&
                  exerciseImages[exercise.imageKey] && (
                    <Image
                      src={exerciseImages[exercise.imageKey]}
                      alt={exercise.name}
                    />
                  )}
              </Exercise>
            ))}
          </Workout>
        </>
      ) : (
        <p>No workout plan available for this day.</p>
      )}
    </Container>
  );
};
