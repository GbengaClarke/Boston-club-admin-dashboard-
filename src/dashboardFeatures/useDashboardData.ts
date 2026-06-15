// src/adminFeatures/useDashboardData.ts
import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "../lib/apiDashboard";


export function useDashboardData(daysRange: number) {
  const {
    data: analytics,
    isLoading,
    error,
    isRefetching,
  } = useQuery({
    // Dynamic query tracking matrix binds changes straight to user interaction state
    queryKey: ["dashboardAnalytics", daysRange],
    queryFn: () => getDashboardAnalytics(daysRange),

  });

  return {
    analytics,
    isLoading,
    error,
    isRefetching,
  };
}