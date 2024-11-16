import styled from "@emotion/styled";

export const WinnerCard = styled.div`
  background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  margin: 1rem 0;
`;

export const CardHeader = styled.div`
  margin-bottom: 1.5rem;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  color: #581c87;
  margin: 0;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const IconContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const WinnerInfo = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const WinnerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const ScoreText = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
`;

export const DifferenceText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

export const TrophyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem; // Space between trophies
  margin: 1rem 0;
  flex-wrap: wrap; // In case screen is too small
  justify-content: center;
`;
