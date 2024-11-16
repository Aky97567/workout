// src/features/dashboard/ui/Dashboard.tsx
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { getAuth } from "firebase/auth";
import { Leaderboard } from "../../../entities";
import { MonthlyWinner, PointsChart, WeeklyStepsChart } from "../../../widgets";
import { useDashboardStats, useWeeklySteps } from "../hooks";
import type { ChartData, ChartTab } from "../../../widgets";
import {
  DashboardContainer,
  Header,
  DatePickerWrapper,
  MonthPickerButton,
  MonthPickerContainer,
  MonthPickerContent,
  SelectContainer,
  StyledSelect,
  ViewMonthButton,
  LoadingContainer,
  ErrorMessage,
} from "../styles/Dashboard.styles";

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

// Color palette for user lines
const USER_COLORS = [
  "#4caf50", // green
  "#2196f3", // blue
  "#ff9800", // orange
  "#e91e63", // pink
  "#9c27b0", // purple
  "#00bcd4", // cyan
] as const;

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<ChartTab>("points");
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { dashboardData, isLoading, error } = useDashboardStats(selectedDate);

  const memoizedUserStats = useMemo(
    () => dashboardData?.userStats ?? [],
    [dashboardData?.userStats]
  );

  const {
    weeklyData,
    isLoading: weeklyLoading,
    error: weeklyError,
    nextWeek,
    previousWeek,
    selectedWeek,
  } = useWeeklySteps(memoizedUserStats);

  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

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

  const handleMonthSelect = () => {
    setSelectedDate(new Date(tempYear, tempMonth, 1));
    setIsMonthPickerOpen(false);
  };

  if (error || weeklyError) {
    return <ErrorMessage>{error || weeklyError}</ErrorMessage>;
  }

  if (isLoading || weeklyLoading) {
    return (
      <LoadingContainer>
        <Loader2Icon className="animate-spin" size={24} />
        Loading dashboard data...
      </LoadingContainer>
    );
  }

  if (!dashboardData) {
    return <ErrorMessage>No data available</ErrorMessage>;
  }

  // Get chart data from dashboardData
  const getChartData = (): ChartData[] => {
    const allDates = new Set(
      Object.values(dashboardData.userDailyPoints)
        .flat()
        .map((point) => point.date)
    );

    return Array.from(allDates)
      .sort()
      .map((date) => {
        const dataPoint: ChartData = {
          date: format(new Date(date), "MMM dd"),
        };

        dashboardData.userStats.forEach((user) => {
          const userPoints = dashboardData.userDailyPoints[user.userId]?.find(
            (point) => point.date === date
          );

          switch (activeTab) {
            case "points":
              dataPoint[user.name] = Number(
                (userPoints?.points || 0).toFixed(2)
              );
              break;
            case "activities":
              dataPoint[`${user.name} (Steps)`] = Number(
                (userPoints?.stepPoints || 0).toFixed(2)
              );
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

  return (
    <DashboardContainer>
      <Header>
        <h1>Fitness Dashboard</h1>
        <DatePickerWrapper>
          <MonthPickerButton
            onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
          >
            {format(selectedDate, "MMMM yyyy")}
          </MonthPickerButton>
          <MonthPickerContainer isOpen={isMonthPickerOpen}>
            <MonthPickerContent>
              <SelectContainer>
                <StyledSelect
                  value={tempYear}
                  onChange={(e) => setTempYear(parseInt(e.target.value))}
                >
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </StyledSelect>
                <StyledSelect
                  value={tempMonth}
                  onChange={(e) => setTempMonth(parseInt(e.target.value))}
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </StyledSelect>
              </SelectContainer>
              <ViewMonthButton onClick={handleMonthSelect}>
                View Month
              </ViewMonthButton>
            </MonthPickerContent>
          </MonthPickerContainer>
        </DatePickerWrapper>
      </Header>

      {currentUserId && dashboardData.userStats && (
        <>
          <MonthlyWinner
            monthData={{
              month: format(selectedDate, "yyyy-MM"),
              metrics: {
                users: Object.fromEntries(
                  dashboardData.userStats.map((user) => [
                    user.userId,
                    { totalPoints: user.totalPoints },
                  ])
                ),
              },
            }}
            currentUser={{
              uid: currentUserId,
              name:
                dashboardData.userStats.find((u) => u.userId === currentUserId)
                  ?.name || "",
            }}
            competitorUser={{
              uid:
                dashboardData.userStats.find((u) => u.userId !== currentUserId)
                  ?.userId || "",
              name:
                dashboardData.userStats.find((u) => u.userId !== currentUserId)
                  ?.name || "",
            }}
          />
          <Leaderboard
            userStats={dashboardData.userStats}
            currentUserId={currentUserId}
          />

          <PointsChart
            data={getChartData()}
            userStats={dashboardData.userStats}
            activeTab={activeTab}
            userColors={userColorMap}
            onTabChange={setActiveTab}
          />

          {weeklyData && (
            <WeeklyStepsChart
              data={weeklyData.days}
              onPreviousWeek={previousWeek}
              onNextWeek={nextWeek}
              selectedWeek={selectedWeek}
            />
          )}
        </>
      )}
    </DashboardContainer>
  );
};
