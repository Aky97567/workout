export interface User {
  uid: string;
  name: string;
}

export interface MonthMetrics {
  users: {
    [key: string]: {
      totalPoints: number;
    };
  };
}

export interface MonthData {
  month: string;
  metrics: MonthMetrics;
}

export interface MonthlyWinnerProps {
  monthData: MonthData;
  currentUser: User;
  competitorUser: User;
}
