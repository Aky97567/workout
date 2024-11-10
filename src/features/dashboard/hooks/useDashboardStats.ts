// src/features/dashboard/hooks/useDashboardStats.ts
import { useUsers } from "./useUsers";
import { useMonthlyStats } from "./useMonthlyStats";
import { calculateTotalStats } from "../../../shared";
import type { DashboardData } from "../../../common";
import { useMemo, useState } from "react";

export const useDashboardStats = (selectedDate: Date) => {
  const { users, isLoading: usersLoading, error: usersError } = useUsers();
  const {
    monthlyData,
    isLoading: monthlyStatsLoading,
    error: monthlyStatsError,
  } = useMonthlyStats(users, selectedDate);

  const dashboardData: DashboardData | null = useMemo(() => {
    return monthlyData
      ? {
          userStats: monthlyData.userStats,
          userDailyPoints: monthlyData.userDailyPoints,
          monthlyStats: {
            dailyPoints: Object.values(monthlyData.userDailyPoints).flat(),
            totalStats: calculateTotalStats(monthlyData.userStats),
          },
        }
      : null;
  }, [monthlyData]);

  return {
    dashboardData,
    isLoading: usersLoading || monthlyStatsLoading,
    error: usersError || monthlyStatsError,
  };
};

export const useMonthPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleMonthSelect = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    selectedDate,
    handleMonthSelect,
  };
};
