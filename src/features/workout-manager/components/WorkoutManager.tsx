// src/features/workout-manager/components/WorkoutManager.tsx
import { useState, useEffect, useCallback, useRef } from "react";
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
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useAuth } from "../../auth";
import {
  ManagerContainer,
  WorkoutGrid,
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
} from "./WorkoutManager.styles";
import "react-day-picker/dist/style.css";
import { WorkoutType } from "../../../common";
import { db } from "../../../shared";
import { workoutTypes } from "../../../common";

// Types for our workout data
interface WorkoutLog {
  id: string;
  userId: string;
  type: WorkoutType;
  duration: number;
  points: number;
  date: Date | null;
  createdAt: Date;
}

// Type for Firestore document data
interface FirestoreWorkoutLog {
  userId: string;
  type: WorkoutType;
  duration: number;
  points: number;
  date: Timestamp | null;
  createdAt: Timestamp;
}

export const WorkoutManager = () => {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutLog | null>(null);
  const [deletingWorkout, setDeletingWorkout] = useState<WorkoutLog | null>(
    null
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = (workout: WorkoutLog) => {
    setEditingWorkout(workout);
  };

  const handleSave = async () => {
    if (!editingWorkout || !currentUser) return;

    try {
      const workoutRef = doc(
        db,
        "users",
        currentUser.uid,
        "workoutLogs",
        editingWorkout.id
      );

      const updateData = {
        date: editingWorkout.date
          ? Timestamp.fromDate(editingWorkout.date)
          : null,
      };

      await updateDoc(workoutRef, updateData);

      setWorkouts(
        workouts.map((w) => (w.id === editingWorkout.id ? editingWorkout : w))
      );

      setEditingWorkout(null);
      setIsDatePickerOpen(false);
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("Error updating workout. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditingWorkout(null);
    setIsDatePickerOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleDelete = (workout: WorkoutLog) => {
    setDeletingWorkout(workout);
  };

  const handleConfirmDelete = async () => {
    if (!deletingWorkout || !currentUser) return;

    try {
      const workoutRef = doc(
        db,
        "users",
        currentUser.uid,
        "workoutLogs",
        deletingWorkout.id
      );

      await deleteDoc(workoutRef);
      setWorkouts(workouts.filter((w) => w.id !== deletingWorkout.id));
      setDeletingWorkout(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Error deleting workout. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setDeletingWorkout(null);
  };

  if (isLoading) {
    return <LoadingSpinner>Loading workouts...</LoadingSpinner>;
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
      <h2>Manage Workouts</h2>
      <WorkoutGrid>
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id}>
            <CardHeader>
              <h3>{workoutTypes[workout.type]}</h3>
              <CardActions>
                <EditButton onClick={() => handleEdit(workout)}>
                  Edit
                </EditButton>
                <DeleteButton onClick={() => handleDelete(workout)}>
                  Delete
                </DeleteButton>
              </CardActions>
            </CardHeader>
            <CardContent>
              <p>Duration: {workout.duration} minutes</p>
              <p>Points: {workout.points}</p>
              <p>
                Date:{" "}
                {workout.date
                  ? format(workout.date, "MMMM d, yyyy")
                  : "No date set"}
              </p>
              <p>Logged: {format(workout.createdAt, "MMMM d, yyyy")}</p>
            </CardContent>
          </WorkoutCard>
        ))}
      </WorkoutGrid>

      {editingWorkout && (
        <Overlay onClick={handleOverlayClick}>
          <EditModal ref={modalRef}>
            <ModalHeader>
              <h3>Edit Workout - {workoutTypes[editingWorkout.type]}</h3>
              <CloseButton onClick={handleCancel}>&times;</CloseButton>
            </ModalHeader>
            <ModalContent>
              <DateFieldGroup>
                <label>Workout Date:</label>
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
                <DatePickerContainer>
                  <DayPicker
                    mode="single"
                    selected={editingWorkout.date || undefined}
                    onSelect={(date) => {
                      setEditingWorkout({
                        ...editingWorkout,
                        date: date || null,
                      });
                    }}
                    disabled={{ after: new Date() }}
                  />
                </DatePickerContainer>
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
        <Overlay onClick={() => setDeletingWorkout(null)}>
          <ConfirmModal>
            <ModalHeader>
              <h3>Delete Workout</h3>
              <CloseButton onClick={handleCancelDelete}>&times;</CloseButton>
            </ModalHeader>
            <ModalContent>
              <p>
                Are you sure you want to delete this{" "}
                {workoutTypes[deletingWorkout.type].toLowerCase()}? This action
                cannot be undone.
              </p>
              <ButtonGroup>
                <SaveButton onClick={handleConfirmDelete}>Delete</SaveButton>
                <CancelButton onClick={handleCancelDelete}>Cancel</CancelButton>
              </ButtonGroup>
            </ModalContent>
          </ConfirmModal>
        </Overlay>
      )}
    </ManagerContainer>
  );
};
