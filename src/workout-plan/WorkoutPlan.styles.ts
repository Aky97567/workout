import styled from "@emotion/styled";
import { mediaQuery } from "../theme";
import { COLOR_PRIMARY } from "../theme/colors";

export const Container = styled.div<{ height: number }>`
  padding: 10px;
  margin: 0 auto;
  max-width: 600px;
  max-height: ${({ height }) => `${height}px`};

  ${mediaQuery("m")} {
    max-width: max-content;
    border: 5px solid ${COLOR_PRIMARY};
    border-radius: 5px;
    margin-top: 20px;
  }
`;

export const Picker = styled.select`
  padding: 10px;
  margin: 0 auto 10px auto;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  color: ${COLOR_PRIMARY};
  background-color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
    color: #333;
  }
`;

export const MuscleGroup = styled.span`
  font-weight: bold;
  color: ${COLOR_PRIMARY};
  font-size: 24px;
`;

export const Workout = styled.div`
  margin-top: 20px;
  overflow-y: auto;
  border: 5px solid ${COLOR_PRIMARY};
  border-radius: 5px;
  padding: 10px;
  flex-grow: 1;

  ${mediaQuery("m")} {
    max-height: max-content;
    border: 0;
  }

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  ::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }
`;

export const Exercise = styled.div`
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px 0 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

export const ExerciseTitle = styled.div<{ needPadding: boolean }>`
  ${({ needPadding }) => needPadding && `padding: 10px 0 10px 0;`}
  font-weight: bold;
`;

export const Image = styled.img`
  width: 100%;
  max-width: 400px;
  margin-top: 10px;
  border-radius: 5px;
`;
