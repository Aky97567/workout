// src/features/workout-logger/components/WorkoutLogger.styles.ts
import styled from "@emotion/styled";

export const LoggerContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: bold;
`;

export const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const DateInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

export const Button = styled.button`
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

export const DatePickerContainer = styled.div`
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #4caf50;
    --rdp-background-color: #e9e9e9;
    margin: 0;
  }

  .rdp-day_selected:not(.rdp-day_disabled):not(.rdp-day_outside) {
    background-color: var(--rdp-accent-color);
  }

  .rdp-day_selected:hover:not(.rdp-day_disabled):not(.rdp-day_outside) {
    background-color: #45a049;
  }
`;

export const DatePickerPopup = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
`;
