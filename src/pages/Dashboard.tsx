// // import { useState } from "react";
// // import { Database, X, Loader2 } from "lucide-react";
// // import { StatCards } from "../components/StatCards";
// // import { RevenueChart, CategoryChart } from "../components/DashboardCharts";
// // import { RecentOrders } from "../components/RecentOrders";
// // import { supabase } from "../lib/supabase";
// // import { motion, AnimatePresence } from "motion/react";
// // import { useDashboardData } from "../dashboardFeatures/useDashboardData";

// // function SupabaseNotice() {
// //   const [visible, setVisible] = useState(!supabase);
// //   return (
// //     <AnimatePresence>
// //       {visible && (
// //         <motion.div
// //           initial={{ opacity: 0, y: -20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           exit={{ opacity: 0, height: 0, overflow: "hidden" }}
// //           className="bg-indigo-600 text-white px-4 py-3 flex items-start sm:items-center justify-between shadow-md relative z-50 mb-8 rounded-xl"
// //         >
// //           <div className="flex items-start sm:items-center gap-3">
// //             <div className="p-2 bg-indigo-500 rounded-lg hidden sm:block">
// //               <Database className="w-5 h-5 text-white" />
// //             </div>
// //             <div>
// //               <p className="font-semibold text-sm">Supabase Not Connected</p>
// //               <p className="text-indigo-100 text-xs mt-0.5 max-w-2xl">
// //                 Viewing layout preview data. To load live sales data, configure{" "}
// //                 <code className="bg-indigo-800 px-1 py-0.5 rounded">
// //                   VITE_SUPABASE_URL
// //                 </code>
// //                 .
// //               </p>
// //             </div>
// //           </div>
// //           <button
// //             onClick={() => setVisible(false)}
// //             className="p-1 hover:bg-indigo-500 rounded-md transition-colors"
// //           >
// //             <X className="w-5 h-5" />
// //           </button>
// //         </motion.div>
// //       )}
// //     </AnimatePresence>
// //   );
// // }

// // export function Dashboard() {
// //   const [daysWindow, setDaysWindow] = useState<number>(7);
// //   const { analytics, isLoading } = useDashboardData(daysWindow);

// //   if (isLoading || !analytics) {
// //     return (
// //       <div className="min-h-[60vh] w-full flex items-center justify-center">
// //         <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <SupabaseNotice />

// //       {/* HEADER CONTROL ACTIONS */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
// //       >
// //         <div className="flex items-center space-x-4">
// //           <h1 className="text-xl font-bold text-slate-800">Store Overview</h1>
// //           <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
// //             Live Data
// //           </span>
// //         </div>

// //         {/* WINDOW RANGE CONTROLLERS */}
// //         <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
// //           {[7, 30, 90].map((days) => (
// //             <button
// //               key={days}
// //               onClick={() => setDaysWindow(days)}
// //               className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
// //                 daysWindow === days
// //                   ? "bg-white text-slate-900 shadow-sm"
// //                   : "text-slate-500 hover:text-slate-900"
// //               }`}
// //             >
// //               {days} Days
// //             </button>
// //           ))}
// //         </div>
// //       </motion.div>

// //       {/* STAT CARDS ROW COMPONENT */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ delay: 0.1 }}
// //       >
// //         <StatCards
// //           revenue={analytics.totalRevenue}
// //           aov={analytics.averageOrderValue}
// //           pending={analytics.activeFulfillmentCount}
// //           cancellations={analytics.cancellationRate}
// //         />
// //       </motion.div>

// //       {/* CHARTS CONTAINER GRID */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ delay: 0.2 }}
// //         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
// //       >
// //         <RevenueChart data={analytics.statusTimeline} />
// //         <CategoryChart
// //           categories={analytics.categoryData}
// //           materials={analytics.materialData}
// //         />
// //       </motion.div>

// //       {/* RECENT ORDERS LOG REGISTER LIST */}
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ delay: 0.3 }}
// //       >
// //         <RecentOrders daysRange={daysWindow} />
// //       </motion.div>
// //     </div>
// //   );
// // }

// // src/pages/Dashboard.tsx
// import { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { StatCards } from "../components/StatCards";
// import { RevenueChart, CategoryChart } from "../components/DashboardCharts";
// import { RecentOrders } from "../components/RecentOrders";
// import { SalesFlowChart } from "../components/SalesFlowChart";
// import { motion } from "motion/react";
// import { useDashboardData } from "../dashboardFeatures/useDashboardData";

// export function Dashboard() {
//   const [daysWindow, setDaysWindow] = useState<number>(7);
//   const { analytics, isLoading } = useDashboardData(daysWindow);

//   if (isLoading || !analytics) {
//     return (
//       <div className="min-h-[60vh] w-full flex items-center justify-center">
//         <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto px-2 py-2 sm:p-0">
//       {/* HEADER CONTROL ACTIONS */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4"
//       >
//         <div className="flex items-center space-x-4">
//           <h1 className="text-xl font-bold text-slate-800">Store Overview</h1>
//           <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
//             Live Data
//           </span>
//         </div>

//         {/* WINDOW RANGE CONTROLLERS */}
//         <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
//           {[7, 30, 90].map((days) => (
//             <button
//               key={days}
//               onClick={() => setDaysWindow(days)}
//               className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-center ${
//                 daysWindow === days
//                   ? "bg-white text-slate-900 shadow-sm"
//                   : "text-slate-500 hover:text-slate-900"
//               }`}
//             >
//               {days} Days
//             </button>
//           ))}
//         </div>
//       </motion.div>

//       {/* STAT CARDS ROW */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//       >
//         <StatCards
//           revenue={analytics.totalRevenue}
//           aov={analytics.averageOrderValue}
//           pending={analytics.activeFulfillmentCount}
//           cancellations={analytics.cancellationRate}
//         />
//       </motion.div>

//       {/* CHARTS CONTAINER GRID */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2 }}
//         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//       >
//         {/* FIXED: Changed data={} to timelineData={} to match your Recharts component signature */}
//         <RevenueChart timelineData={analytics.statusTimeline} />
//         <CategoryChart
//           categories={analytics.categoryData}
//           materials={analytics.materialData}
//         />
//       </motion.div>

//       {/* SALES FLOW METRIC FLOW CHART */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.25 }}
//       >
//         <SalesFlowChart flow={analytics.salesFlow} />
//       </motion.div>

//       {/* RECENT ORDERS LOG REGISTER LIST */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//       >
//         <RecentOrders daysRange={daysWindow} />
//       </motion.div>
//     </div>
//   );
// }

import { useState } from "react";
import { Database, X, Loader2 } from "lucide-react";
import { StatCards } from "../components/StatCards";
import { RevenueChart, CategoryChart } from "../components/DashboardCharts";
import { RecentOrders } from "../components/RecentOrders";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { useDashboardData } from "../dashboardFeatures/useDashboardData";

function SupabaseNotice() {
  const [visible, setVisible] = useState(!supabase);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
          className="bg-indigo-600 text-white px-4 py-3 flex items-start sm:items-center justify-between shadow-md relative z-50 mb-8 rounded-xl"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg hidden sm:block">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Supabase Not Connected</p>
              <p className="text-indigo-100 text-xs mt-0.5 max-w-2xl">
                Viewing layout preview data. To load live sales data, configure{" "}
                <code className="bg-indigo-800 px-1 py-0.5 rounded">
                  VITE_SUPABASE_URL
                </code>
                .
              </p>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="p-1 hover:bg-indigo-500 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Dashboard() {
  const [daysWindow, setDaysWindow] = useState<number>(7);
  const { analytics, isLoading } = useDashboardData(daysWindow);

  if (isLoading || !analytics) {
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SupabaseNotice />

      {/* HEADER CONTROL ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-slate-800">Store Overview</h1>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live Data
          </span>
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

      {/* RECENT ORDERS LOG REGISTER LIST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RecentOrders daysRange={daysWindow} />
      </motion.div>
    </div>
  );
}
