// src/features/dashboard/components/Dashboard.tsx
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader2Icon } from "lucide-react";
import { useDashboardStats, useMonthPicker } from "../hooks/useDashboardStats";
import { getAuth } from "firebase/auth";
import type { ChartTab } from "../types";
import {
  DashboardContainer,
  Header,
  DatePickerWrapper,
  MonthPickerButton,
  MonthPickerContainer,
  StatsGrid,
  StatsCard,
  StatsCardTitle,
  ChartContainer,
  LeaderboardContainer,
  LeaderboardTitle,
  LeaderboardItem,
  UserInfo,
  UserName,
  UserStats,
  Points,
  NoDataMessage,
  LoadingSpinner,
  TabContainer,
  TabList,
  Tab,
} from "../styles/Dashboard.styles";

// Color palette for user lines
const USER_COLORS = [
  "#4caf50", // green
  "#2196f3", // blue
  "#ff9800", // orange
  "#e91e63", // pink
  "#9c27b0", // purple
  "#00bcd4", // cyan
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export const Dashboard: React.FC = () => {
  const { isOpen, setIsOpen, selectedDate, handleMonthSelect } =
    useMonthPicker();
  const { dashboardData, isLoading, error } = useDashboardStats(selectedDate);
  const [activeTab, setActiveTab] = useState<ChartTab>("points");
  const auth = getAuth();

  const [tempYear, setTempYear] = useState(selectedDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(selectedDate.getMonth());

  const handleDateSelect = () => {
    handleMonthSelect(new Date(tempYear, tempMonth, 1));
    setIsOpen(false);
  };

  // Generate color map for users
  const userColorMap = useMemo(() => {
    if (!dashboardData?.userStats) return {};
    return Object.fromEntries(
      dashboardData.userStats.map((user, index) => [
        user.userId,
        USER_COLORS[index % USER_COLORS.length],
      ])
    );
  }, [dashboardData?.userStats]);

  if (error) {
    return <NoDataMessage>{error}</NoDataMessage>;
  }

  if (isLoading) {
    return (
      <LoadingSpinner>
        <Loader2Icon className="animate-spin" size={24} />
        Loading dashboard data...
      </LoadingSpinner>
    );
  }

  if (!dashboardData) {
    return <NoDataMessage>No data available</NoDataMessage>;
  }

  // Organize daily points by date for comparison
  const getChartData = () => {
    const allDates = new Set(
      Object.values(dashboardData.userDailyPoints)
        .flat()
        .map((point) => point.date)
    );

    const sortedDates = Array.from(allDates).sort();

    return sortedDates.map((date) => {
      const dataPoint: Record<string, string | number> = {
        date: format(new Date(date), "MMM dd"),
      };

      // Add data for each user
      dashboardData.userStats.forEach((user) => {
        const userPoints = dashboardData.userDailyPoints[user.userId]?.find(
          (point) => point.date === date
        );

        switch (activeTab) {
          case "points":
            dataPoint[user.name] = userPoints?.points || 0;
            break;
          case "activities":
            dataPoint[`${user.name} (Steps)`] = userPoints?.stepPoints || 0;
            dataPoint[`${user.name} (Workouts)`] =
              userPoints?.workoutPoints || 0;
            break;
          case "habits":
            dataPoint[`${user.name} (Habits)`] = userPoints?.habitPoints || 0;
            break;
        }
      });

      return dataPoint;
    });
  };

  // Calculate personal stats for each user
  const userStats = dashboardData.userStats
    .map((user) => {
      const monthPoints =
        dashboardData.userDailyPoints[user.userId]?.reduce(
          (sum, day) => sum + day.points,
          0
        ) || 0;

      return {
        ...user,
        monthPoints,
      };
    })
    .sort((a, b) => b.monthPoints - a.monthPoints);

  const currentUserId = auth.currentUser?.uid;

  return (
    <DashboardContainer>
      <Header>
        <h1>Fitness Dashboard</h1>
        <DatePickerWrapper>
          <MonthPickerButton onClick={() => setIsOpen(!isOpen)}>
            {format(selectedDate, "MMMM yyyy")}
          </MonthPickerButton>
          <MonthPickerContainer isOpen={isOpen}>
            <div className="p-4 bg-white rounded shadow-lg">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <select
                    value={tempYear}
                    onChange={(e) => setTempYear(parseInt(e.target.value))}
                    className="flex-1 p-2 border rounded"
                  >
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    value={tempMonth}
                    onChange={(e) => setTempMonth(parseInt(e.target.value))}
                    className="flex-1 p-2 border rounded"
                  >
                    {MONTHS.map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleDateSelect}
                  className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                >
                  View Month
                </button>
              </div>
            </div>
          </MonthPickerContainer>
        </DatePickerWrapper>
      </Header>

      <StatsGrid>
        {userStats.slice(0, 4).map((user) => (
          <StatsCard key={user.userId}>
            <StatsCardTitle>{user.name}</StatsCardTitle>
            <div className="text-3xl font-bold mb-2">
              {user.monthPoints.toLocaleString()}
            </div>
            <div className="text-gray-600">
              {user.workouts} workouts · {Math.round(user.steps / 1000)}k steps
            </div>
          </StatsCard>
        ))}
      </StatsGrid>

      <TabContainer>
        <TabList>
          <Tab
            active={activeTab === "points"}
            onClick={() => setActiveTab("points")}
          >
            Total Points
          </Tab>
          <Tab
            active={activeTab === "activities"}
            onClick={() => setActiveTab("activities")}
          >
            Activities
          </Tab>
          <Tab
            active={activeTab === "habits"}
            onClick={() => setActiveTab("habits")}
          >
            Habits
          </Tab>
        </TabList>

        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getChartData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {activeTab === "points" &&
                dashboardData.userStats.map((user) => (
                  <Line
                    key={user.userId}
                    type="monotone"
                    dataKey={user.name}
                    stroke={userColorMap[user.userId]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              {activeTab === "activities" &&
                dashboardData.userStats.flatMap((user) => [
                  <Line
                    key={`${user.userId}-steps`}
                    type="monotone"
                    dataKey={`${user.name} (Steps)`}
                    stroke={userColorMap[user.userId]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />,
                  <Line
                    key={`${user.userId}-workouts`}
                    type="monotone"
                    dataKey={`${user.name} (Workouts)`}
                    stroke={userColorMap[user.userId]}
                    strokeWidth={2}
                  />,
                ])}
              {activeTab === "habits" &&
                dashboardData.userStats.map((user) => (
                  <Line
                    key={user.userId}
                    type="monotone"
                    dataKey={`${user.name} (Habits)`}
                    stroke={userColorMap[user.userId]}
                    strokeWidth={2}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </TabContainer>

      <LeaderboardContainer>
        <LeaderboardTitle>Monthly Leaderboard</LeaderboardTitle>
        {userStats.map((user) => (
          <LeaderboardItem
            key={user.userId}
            isCurrentUser={user.userId === currentUserId}
          >
            <UserInfo>
              <UserName style={{ color: userColorMap[user.userId] }}>
                {user.name}
              </UserName>
              <UserStats>
                {user.workouts} workouts · {Math.round(user.steps / 1000)}k
                steps · {user.streak} day streak
              </UserStats>
            </UserInfo>
            <Points>{user.monthPoints.toLocaleString()} pts</Points>
          </LeaderboardItem>
        ))}
      </LeaderboardContainer>
    </DashboardContainer>
  );
};
