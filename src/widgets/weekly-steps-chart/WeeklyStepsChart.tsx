// src/widgets/weekly-steps-chart/ui/index.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { WeeklyChartProps } from "../../common";
import {
  ChartSection,
  ChartHeader,
  ChartTitle,
  WeekNavigation,
  WeekNavigationButton,
  ChartContainer,
} from "./styles";

export const WeeklyStepsChart = ({
  data,
  onPreviousWeek,
  onNextWeek,
  selectedWeek,
}: WeeklyChartProps) => (
  <ChartSection>
    <ChartHeader>
      <ChartTitle>
        Weekly Steps - {format(selectedWeek, "MMM d")} to{" "}
        {format(selectedWeek, "MMM d, yyyy")}
      </ChartTitle>
      <WeekNavigation>
        <WeekNavigationButton onClick={onPreviousWeek}>
          Previous Week
        </WeekNavigationButton>
        <WeekNavigationButton onClick={onNextWeek}>
          Next Week
        </WeekNavigationButton>
      </WeekNavigation>
    </ChartHeader>
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateDisplay" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => value.toLocaleString()}
            labelFormatter={(label: string) => `Date: ${label}`}
          />
          <Bar dataKey="steps" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </ChartSection>
);
