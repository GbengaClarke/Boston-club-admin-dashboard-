import { useState } from "react";
import { StatCards } from "../components/StatCards";
import { RevenueChart, CategoryChart } from "../components/DashboardCharts";
import { RecentOrders } from "../components/RecentOrders";
import { motion } from "motion/react";
import { useDashboardData } from "../dashboardFeatures/useDashboardData";
import { DashboardSkeleton } from "../components/dashboardSkeleton";
import { SalesFlowChart } from "../components/SalesFlowChart";

export function Dashboard() {
  const [daysWindow, setDaysWindow] = useState<number>(30);
  const { analytics, isLoading } = useDashboardData(daysWindow);

  if (isLoading || !analytics) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* HEADER CONTROL ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-slate-800">Store Overview</h1>
        </div>

        {/* WINDOW RANGE CONTROLLERS */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setDaysWindow(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                daysWindow === days
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </motion.div>

      {/* STAT CARDS ROW COMPONENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCards
          revenue={analytics.totalRevenue}
          aov={analytics.averageOrderValue}
          pending={analytics.activeFulfillmentCount}
          cancellations={analytics.cancellationRate}
        />
      </motion.div>

      {/* RECENT ORDERS LOG REGISTER LIST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RecentOrders daysRange={daysWindow} />
      </motion.div>

      {/* CHARTS CONTAINER GRID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <RevenueChart data={analytics.statusTimeline} />
        <CategoryChart
          categories={analytics.categoryData}
          materials={analytics.materialData}
        />
      </motion.div>

      {/* SALES FLOW METRIC FLOW CHART */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* NEW MOUNT: Stacked Sales flow analysis mapped strictly to day filters */}
        <SalesFlowChart flow={analytics.salesFlow} daysRange={daysWindow} />
      </motion.div>
    </div>
  );
}
