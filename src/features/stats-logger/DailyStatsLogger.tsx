// src/features/daily-stats/DailyStatsLogger.tsx
import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, startOfDay } from "date-fns";
import { useAuth } from "../auth";
import { useDailyStats } from "./hooks/useDailyStats";
import styled from "@emotion/styled";
import "react-day-picker/dist/style.css";

const LoggerContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const DateInput = styled(Input)`
  cursor: pointer;
  background-color: white;
  &:read-only {
    background-color: white;
  }
`;

const HabitGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 4px;
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

const PointsSummary = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e8f5e9;
  border-radius: 4px;
  font-weight: bold;
`;

const DatePickerContainer = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .rdp {
    margin: 0;
    padding: 1rem;
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
`;

const calculateStepPoints = (steps: number): number => {
  const points = Math.floor(steps / 2000);
  return Math.min(points, 5);
};

export const DailyStatsLogger: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(new Date())
  );
  const datePickerRef = useRef<HTMLDivElement>(null);

  const {
    steps,
    setSteps,
    habits,
    handleHabitToggle,
    isLoading,
    isSaving,
    saveDailyStats,
    isDatePickerOpen,
    setIsDatePickerOpen,
  } = useDailyStats(currentUser?.uid, selectedDate);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(startOfDay(date));
      setIsDatePickerOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveDailyStats();
    if (success) {
      alert("Daily stats updated successfully!");
    } else {
      alert("Error updating daily stats");
    }
  };

  if (!currentUser) {
    return <div>Please log in to track stats</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalPoints =
    calculateStepPoints(steps) + habits.filter((h) => h.completed).length;

  return (
    <LoggerContainer>
      <h2>Daily Stats</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Date</Label>
          <DatePickerWrapper>
            <DateInput
              readOnly
              value={format(selectedDate, "PPP")}
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            />
            <DatePickerContainer isOpen={isDatePickerOpen} ref={datePickerRef}>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={{ after: new Date() }}
                defaultMonth={selectedDate}
              />
            </DatePickerContainer>
          </DatePickerWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Steps</Label>
          <Input
            type="number"
            min="0"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Healthy Habits</Label>
          {habits.map((habit) => (
            <HabitGroup key={habit.type}>
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => handleHabitToggle(habit.type)}
                id={habit.type}
              />
              <Label htmlFor={habit.type}>
                {habit.type === "meals" && "Logged all meals"}
                {habit.type === "water" && "Met water intake goal (2L)"}
                {habit.type === "sleep" && "7+ hours of sleep"}
              </Label>
            </HabitGroup>
          ))}
        </FormGroup>

        <PointsSummary>
          Points for {format(selectedDate, "PPP")}: {totalPoints}
          <br />
          (Steps: {calculateStepPoints(steps)} + Habits:{" "}
          {habits.filter((h) => h.completed).length})
        </PointsSummary>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Updating..." : "Update Daily Stats"}
        </Button>
      </Form>
    </LoggerContainer>
  );
};
