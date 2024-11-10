// src/features/dashboard/ui/styles.ts
import styled from "@emotion/styled";

export const DashboardContainer = styled.div`
  @media (max-width: 500px) {
    padding: 0.5rem;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const DatePickerWrapper = styled.div`
  position: relative;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

export const MonthPickerButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  @media (max-width: 500px) {
    width: 100%;
    text-align: left;
  }

  &:hover {
    background: #f5f5f5;
  }
`;

export const MonthPickerContainer = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
  padding: 1rem;

  @media (max-width: 500px) {
    right: 0;
    left: 0;
  }
`;

export const MonthPickerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SelectContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const StyledSelect = styled.select`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
`;

export const ViewMonthButton = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #666;
  gap: 0.5rem;
`;

export const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  padding: 2rem;
`;
