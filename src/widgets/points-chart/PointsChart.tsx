// src/widgets/points-chart/ui/index.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { UserStats } from "../../common";
import {
  ChartContainer,
  ChartSection,
  Tab,
  TabContainer,
  TabList,
} from "./styles";

export type ChartTab = "points" | "activities" | "habits";

export interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface PointsChartProps {
  data: ChartData[];
  userStats: UserStats[]; // Added this prop
  activeTab: ChartTab;
  userColors: Record<string, string>;
  onTabChange: (tab: ChartTab) => void;
}

export const PointsChart = ({
  data,
  userStats,
  activeTab,
  userColors,
  onTabChange,
}: PointsChartProps) => (
  <ChartSection>
    <TabContainer>
      <TabList>
        <Tab
          active={activeTab === "points"}
          onClick={() => onTabChange("points")}
        >
          Total Points
        </Tab>
        <Tab
          active={activeTab === "activities"}
          onClick={() => onTabChange("activities")}
        >
          Activities
        </Tab>
        <Tab
          active={activeTab === "habits"}
          onClick={() => onTabChange("habits")}
        >
          Habits
        </Tab>
      </TabList>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {activeTab === "points" &&
              userStats.map((user: UserStats) => (
                <Line
                  key={user.userId}
                  type="monotone"
                  dataKey={user.name}
                  stroke={userColors[user.userId]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            {activeTab === "activities" &&
              userStats.flatMap((user: UserStats) => [
                <Line
                  key={`${user.userId}-steps`}
                  type="monotone"
                  dataKey={`${user.name} (Steps)`}
                  stroke={userColors[user.userId]}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />,
                <Line
                  key={`${user.userId}-workouts`}
                  type="monotone"
                  dataKey={`${user.name} (Workouts)`}
                  stroke={userColors[user.userId]}
                  strokeWidth={2}
                />,
              ])}
            {activeTab === "habits" &&
              userStats.map((user: UserStats) => (
                <Line
                  key={user.userId}
                  type="monotone"
                  dataKey={`${user.name} (Habits)`}
                  stroke={userColors[user.userId]}
                  strokeWidth={2}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </TabContainer>
  </ChartSection>
);
