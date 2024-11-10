// src/widgets/weekly-steps-chart/ui/styles.ts
import styled from "@emotion/styled";

export const ChartSection = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 1rem;
`;

export const ChartHeader = styled.div`
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

export const ChartTitle = styled.h3`
  margin: 0;
`;

export const WeekNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const WeekNavigationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #4caf50;
  background: white;
  color: #4caf50;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #f5f5f5;
  }
`;

export const ChartContainer = styled.div`
  height: 300px;
  width: 100%;

  @media (max-width: 500px) {
    height: 200px;
  }
`;
