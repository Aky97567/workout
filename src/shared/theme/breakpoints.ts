export type BreakpointKey = "s" | "m" | "l" | "xl";

type BreakpointValue = {
  [key in BreakpointKey]: number;
};

export const breakpoints: BreakpointValue = {
  s: 480,
  m: 768,
  l: 1024,
  xl: 1200,
};
