import styled from "@emotion/styled";
import { mediaQuery } from "../theme";

export const Container = styled.div`
  padding: 10px;
  margin: 0 auto;
  max-width: 600px;

  ${mediaQuery("m")} {
    max-width: max-content;
    border: 5px solid #0070f3;
    border-radius: 5px;
    margin-top: 20px;
  }
`;

export const Picker = styled.select`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  cursor: pointer;
  color: #f8f8f8;
  background-color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
    color: #333;
  }
`;

export const Workout = styled.div`
  margin-top: 20px;
  overflow-y: auto;
  max-height: 60vh;
  border: 5px solid #0070f3;
  border-radius: 5px;
  padding: 10px;

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

export const Title = styled.h2`
  font-size: 20px;
  margin: 0 0 10px 0;
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
