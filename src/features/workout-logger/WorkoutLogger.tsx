// src/features/workout-logger/components/WorkoutLogger.tsx
import React, { useState, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { db } from "../../shared/config";
import { WorkoutType, workoutTypes } from "../../common";
import { useAuth } from "../auth";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  LoggerContainer,
  Select,
  DatePickerContainer,
  DatePickerPopup,
  DateInput,
} from "./WorkoutLogger.styles";
import "react-day-picker/dist/style.css";

export const WorkoutLogger = () => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>("gym");
  const [duration, setDuration] = useState<number>(30);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Close date picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculatePoints = (type: WorkoutType, duration: number): number => {
    if (duration < 30) return 0;

    const pointsMap: Record<WorkoutType, number> = {
      gym: 3,
      pilates: 3,
      sports: 3,
      swimming: 3,
      fitness_class: 3,
      yoga: 2,
      cycling: 2,
      running: 1,
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

    // Set the time of selectedDate to noon to avoid timezone issues
    const workoutDate = new Date(selectedDate);
    workoutDate.setHours(12, 0, 0, 0);

    const workoutLog = {
      userId: currentUser.uid,
      date: workoutDate,
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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsDatePickerOpen(false);
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
          <Label>Workout Date</Label>
          <div ref={datePickerRef} style={{ position: "relative" }}>
            <DateInput
              type="text"
              value={format(selectedDate, "MMMM d, yyyy")}
              onClick={() => setIsDatePickerOpen(true)}
              readOnly
            />
            {isDatePickerOpen && (
              <DatePickerPopup>
                <DatePickerContainer>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={{ after: new Date() }}
                  />
                </DatePickerContainer>
              </DatePickerPopup>
            )}
          </div>
        </FormGroup>

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
