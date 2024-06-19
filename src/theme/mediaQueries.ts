import { breakpoints, BreakpointKey } from "./breakpoints";

export const mediaQuery = (key: BreakpointKey) => {
  return () => `
    @media (min-width: ${breakpoints[key]}px) 
  `;
};
