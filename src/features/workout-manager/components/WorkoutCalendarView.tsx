import React, { useMemo } from "react";
import { format } from "date-fns";
import type { WorkoutLogWithNullableDate } from "../hooks/useWorkoutManager";
import { StyledDayPicker } from "./WorkoutManager.styles";

interface WorkoutCalendarViewProps {
  workouts: WorkoutLogWithNullableDate[];
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export const WorkoutCalendarView: React.FC<WorkoutCalendarViewProps> = ({
  workouts,
  selectedDate,
  onDateSelect,
}) => {
  const workoutDates = useMemo(() => {
    const dates = new Set<string>();
    workouts.forEach((workout) => {
      if (workout.date) {
        dates.add(format(workout.date, "yyyy-MM-dd"));
      }
    });
    return dates;
  }, [workouts]);

  const modifiers = useMemo(
    () => ({
      has_workout: (date: Date) => workoutDates.has(format(date, "yyyy-MM-dd")),
    }),
    [workoutDates]
  );

  const handleSelect = (selectedDay: Date | undefined) => {
    onDateSelect(selectedDay ?? null);
  };

  return (
    <StyledDayPicker
      mode="single"
      selected={selectedDate || undefined}
      onSelect={handleSelect}
      modifiers={modifiers}
      modifiersClassNames={{
        has_workout: "rdp-day_has_workout",
      }}
    />
  );
};
