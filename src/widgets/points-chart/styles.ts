// src/widgets/points-chart/ui/styles.ts
import styled from "@emotion/styled";

export const ChartSection = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  padding: 1rem;
`;

export const TabContainer = styled.div`
  overflow-x: auto;
`;

export const TabList = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 500px) {
    padding-bottom: 0.5rem;
  }
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${(props) => (props.active ? "#4caf50" : "#f5f5f5")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.active ? "#45a049" : "#e0e0e0")};
  }
`;

export const ChartContainer = styled.div`
  height: 300px;
  width: 100%;

  @media (max-width: 500px) {
    height: 200px;
  }
`;
