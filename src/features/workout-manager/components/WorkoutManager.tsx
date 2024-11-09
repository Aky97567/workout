import React, { useRef } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { useAuth } from "../../auth";
import { workoutTypes } from "../../../common";
import { useWorkoutManager } from "../hooks/useWorkoutManager";
import { WorkoutCalendarView } from "./WorkoutCalendarView";
import {
  ManagerContainer,
  CalendarContainer,
  WorkoutsListContainer,
  WorkoutCard,
  CardHeader,
  CardContent,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton,
  ButtonGroup,
  DateInput,
  DatePickerContainer,
  DatePickerWrapper,
  NoWorkouts,
  LoadingSpinner,
  Overlay,
  EditModal,
  ConfirmModal,
  ModalHeader,
  CloseButton,
  ModalContent,
  DateFieldGroup,
  CardActions,
  EmptyState,
  DayWorkouts,
} from "./WorkoutManager.styles";
import "react-day-picker/dist/style.css";

export const WorkoutManager = () => {
  const { currentUser } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    workouts,
    editingWorkout,
    deletingWorkout,
    selectedDate,
    isLoading,
    isDatePickerOpen,
    setEditingWorkout,
    setDeletingWorkout,
    setIsDatePickerOpen,
    setSelectedDate,
    handleEdit,
    handleUpdateWorkout,
    handleDelete,
  } = useWorkoutManager(currentUser);

  const selectedDateWorkouts = React.useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return workouts.filter(
      (workout) =>
        workout.date && format(workout.date, "yyyy-MM-dd") === dateStr
    );
  }, [selectedDate, workouts]);

  const handleSave = async () => {
    if (!editingWorkout) return;

    try {
      await handleUpdateWorkout(editingWorkout.id, {
        date: editingWorkout.date,
        duration: editingWorkout.duration,
      });
    } catch (error) {
      alert("Error updating activity. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditingWorkout(null);
    setIsDatePickerOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingWorkout) return;
    try {
      await handleDelete(deletingWorkout.id);
    } catch (error) {
      alert("Error deleting activity. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner>Loading activities...</LoadingSpinner>;
  }

  if (!workouts.length) {
    return (
      <NoWorkouts>
        No workouts logged yet. Start by logging a workout!
      </NoWorkouts>
    );
  }

  return (
    <ManagerContainer>
      <h2>Manage Activities</h2>

      <CalendarContainer>
        <WorkoutCalendarView
          workouts={workouts}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <DayWorkouts>
          <h3>
            {selectedDate
              ? `Workouts for ${format(selectedDate, "MMMM d, yyyy")}`
              : "Select a date to view activities"}
          </h3>

          {selectedDate ? (
            <WorkoutsListContainer>
              {selectedDateWorkouts.length > 0 ? (
                selectedDateWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id}>
                    <CardHeader>
                      <h3>{workoutTypes[workout.type]}</h3>
                      <CardActions>
                        <EditButton onClick={() => handleEdit(workout)}>
                          Edit
                        </EditButton>
                        <DeleteButton
                          onClick={() => setDeletingWorkout(workout)}
                        >
                          Delete
                        </DeleteButton>
                      </CardActions>
                    </CardHeader>
                    <CardContent>
                      <p>Duration: {workout.duration} minutes</p>
                      <p>Points: {workout.points}</p>
                    </CardContent>
                  </WorkoutCard>
                ))
              ) : (
                <EmptyState>No activities logged for this date</EmptyState>
              )}
            </WorkoutsListContainer>
          ) : (
            <EmptyState>Select a date to view activities</EmptyState>
          )}
        </DayWorkouts>
      </CalendarContainer>

      {editingWorkout && (
        <Overlay
          onClick={(e) => e.target === e.currentTarget && handleCancel()}
        >
          <EditModal ref={modalRef}>
            <ModalHeader>
              <h3>Edit Workout - {workoutTypes[editingWorkout.type]}</h3>
              <CloseButton onClick={handleCancel}>&times;</CloseButton>
            </ModalHeader>
            <ModalContent>
              <DateFieldGroup>
                <label>Duration (minutes):</label>
                <input
                  type="number"
                  min="0"
                  value={editingWorkout.duration}
                  onChange={(e) =>
                    setEditingWorkout({
                      ...editingWorkout,
                      duration: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </DateFieldGroup>
              <DateFieldGroup>
                <label>Activity Date:</label>
                <DatePickerWrapper>
                  <DateInput
                    type="text"
                    value={
                      editingWorkout.date
                        ? format(editingWorkout.date, "MMMM d, yyyy")
                        : "Select date"
                    }
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    readOnly
                  />
                </DatePickerWrapper>
                {isDatePickerOpen && (
                  <DatePickerContainer>
                    <DayPicker
                      mode="single"
                      selected={editingWorkout.date || undefined}
                      onSelect={(date) =>
                        setEditingWorkout({
                          ...editingWorkout,
                          date: date || null,
                        })
                      }
                      disabled={{ after: new Date() }}
                    />
                  </DatePickerContainer>
                )}
              </DateFieldGroup>
              <ButtonGroup>
                <SaveButton onClick={handleSave}>Save Changes</SaveButton>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
              </ButtonGroup>
            </ModalContent>
          </EditModal>
        </Overlay>
      )}

      {deletingWorkout && (
        <Overlay
          onClick={(e) =>
            e.target === e.currentTarget && setDeletingWorkout(null)
          }
        >
          <ConfirmModal>
            <ModalHeader>
              <h3>Delete Workout</h3>
              <CloseButton onClick={() => setDeletingWorkout(null)}>
                &times;
              </CloseButton>
            </ModalHeader>
            <ModalContent>
              <p>
                Are you sure you want to delete this{" "}
                {workoutTypes[deletingWorkout.type].toLowerCase()}? This action
                cannot be undone.
              </p>
              <ButtonGroup>
                <SaveButton onClick={handleConfirmDelete}>Delete</SaveButton>
                <CancelButton onClick={() => setDeletingWorkout(null)}>
                  Cancel
                </CancelButton>
              </ButtonGroup>
            </ModalContent>
          </ConfirmModal>
        </Overlay>
      )}
    </ManagerContainer>
  );
};
