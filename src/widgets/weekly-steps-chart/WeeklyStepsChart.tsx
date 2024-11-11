import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { endOfWeek, format, startOfWeek } from "date-fns";
import type { WeeklyChartProps, WeeklyStepData } from "../../common";
import {
  ChartSection,
  ChartHeader,
  ChartTitle,
  WeekNavigation,
  WeekNavigationButton,
  ChartContainer,
} from "./styles";
import { generateColor } from "../../shared";

interface DayData {
  date: string;
  [userId: string]: number | string;
}

// Create mappings for user colors and names based on the data
const createUserMappings = (data: WeeklyStepData[]) => {
  const userNames: { [userId: string]: string } = {};
  const userColors: { [userId: string]: string } = {};

  data.forEach((day) => {
    if (!userNames[day.userId]) {
      userNames[day.userId] = day.userName;
      userColors[day.userId] = generateColor(day.userId);
    }
  });

  return { userNames, userColors };
};

export const WeeklyStepsChart = ({
  data,
  onPreviousWeek,
  onNextWeek,
  selectedWeek,
}: WeeklyChartProps) => {
  // Generate user mappings for colors and names
  const { userNames, userColors } = createUserMappings(data);

  // Transform the data into grouped format with each date containing steps for each user
  const groupedData: DayData[] = data.reduce((acc: DayData[], day) => {
    const existingDay = acc.find((d) => d.date === day.dateDisplay);
    if (existingDay) {
      existingDay[day.userId] = day.steps;
    } else {
      acc.push({ date: day.dateDisplay, [day.userId]: day.steps });
    }
    return acc;
  }, []);

  return (
    <ChartSection>
      <ChartHeader>
        <ChartTitle>
          Weekly Steps -{" "}
          {format(startOfWeek(selectedWeek, { weekStartsOn: 0 }), "MMM d")} to{" "}
          {format(endOfWeek(selectedWeek, { weekStartsOn: 0 }), "MMM d, yyyy")}
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
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} steps`,
                userNames[name],
              ]}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            {Object.keys(userColors).map((userId) => (
              <Bar
                key={userId}
                dataKey={userId}
                name={userNames[userId]}
                fill={userColors[userId]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartSection>
  );
};
