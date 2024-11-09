// src/features/workout-manager/components/WorkoutManager.styles.ts
import styled from "@emotion/styled";

export const ManagerContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;

  h2 {
    margin-bottom: 2rem;
  }
`;

export const WorkoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

export const WorkoutCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  background: #4caf50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
`;

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const CardContent = styled.div`
  padding: 1rem;

  p {
    margin: 0.5rem 0;
    color: #666;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
`;

export const ButtonBase = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
`;

export const EditButton = styled(ButtonBase)`
  background: transparent;
  color: white;
  padding: 0.25rem 0.75rem;
  border: 1px solid white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const DeleteButton = styled(ButtonBase)`
  background: transparent;
  color: white;
  padding: 0.25rem 0.75rem;
  border: 1px solid #ffcdd2;

  &:hover {
    background: rgba(255, 0, 0, 0.1);
  }
`;

export const SaveButton = styled(ButtonBase)`
  background: #4caf50;
  color: white;

  &:hover {
    background: #45a049;
  }
`;

export const CancelButton = styled(ButtonBase)`
  background: #f44336;
  color: white;
  margin-left: 0.5rem;

  &:hover {
    background: #d32f2f;
  }
`;

export const NoWorkouts = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

export const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalHeader = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;

  &:hover {
    color: #333;
  }
`;

export const EditModal = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  min-height: 400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ConfirmModal = styled(EditModal)`
  min-height: auto;
  text-align: center;

  p {
    margin: 1rem 0 2rem;
    color: #666;
  }
`;

export const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const DateFieldGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .rdp {
    margin: 1rem 0;
  }
`;

export const DatePickerContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .rdp {
    --rdp-cell-size: 45px; // Slightly larger cells
    --rdp-accent-color: #4caf50;
    --rdp-background-color: #e9e9e9;
    margin: 0;
  }

  .rdp-day {
    font-size: 1rem;
  }

  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: #e9e9e9;
  }
`;

export const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const DateInput = styled.input`
  width: 80%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  cursor: pointer;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;