import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { CreditCard, ShieldCheck, AlertCircle } from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface SalesFlowChartProps {
  flow: {
    grossBooked: number;
    finalizedRevenue: number;
    heldInPipeline: number;
    lostVolume: number;
  };
  daysRange: number;
}

export function SalesFlowChart({ flow, daysRange }: SalesFlowChartProps) {
  const data = [
    {
      name: `Past ${daysRange} Days`,
      "Lost Earnings": flow.lostVolume,
      "Cleared Cash": flow.finalizedRevenue,
      "Held in Transit": flow.heldInPipeline,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Revenue Performance Pipeline
          </h3>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Visualization of how incoming booked invoice values filter into
            finalized cash.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg select-all self-start sm:self-auto">
          Gross Volume: {formatCurrency(flow.grossBooked, false)}
        </div>
      </div>

      {/* RECHARTS STACKED VISUALIZER CONTAINER */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#E2E8F0"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
              tickFormatter={(value) => formatCurrency(value, false)}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#1E293B", fontWeight: 700 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #CBD5E1",
                boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.08)",
                fontSize: "12px",
                fontWeight: 600,
              }}
              formatter={(value: number) => [formatCurrency(value, false)]}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconSize={10}
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#1E293B",
              }}
            />

            {/* Cleared Funds Stack Segment */}
            <Bar
              dataKey="Cleared Cash"
              stackId="revenue"
              fill="#059669"
              radius={[0, 0, 0, 0]}
              barSize={44}
            />
            {/* Pending Pipeline Stack Segment */}
            <Bar
              dataKey="Held in Transit"
              stackId="revenue"
              fill="#4F46E5"
              radius={[0, 0, 0, 0]}
            />
            {/* Lost Earnings Stack Segment */}
            <Bar
              dataKey="Lost Earnings"
              stackId="revenue"
              fill="#E11D48"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* METRIC CARD GRID INSERTS UNDER CHART */}
      <div className="grid grid-cols-1 min-[504px]:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
        {/* CARD 1 */}
        <div className="bg-emerald-50 border border-emerald-100/80 p-3 rounded-lg flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <div className="min-w-0">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Cleared Cash
            </span>
            <span className="block text-sm font-black text-slate-900 truncate select-all">
              {formatCurrency(flow.finalizedRevenue, false)}
            </span>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-indigo-50 border border-indigo-100/80 p-3 rounded-lg flex items-center gap-3">
          <Hourglass className="w-5 h-5 text-indigo-700 flex-shrink-0" />
          <div className="min-w-0">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-indigo-800 ">
              Held in Transit
            </span>
            <span className="block text-sm font-black text-slate-900 truncate select-all">
              {formatCurrency(flow.heldInPipeline, false)}
            </span>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="bg-rose-50 border border-rose-100/80 p-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0" />
          <div className="min-w-0">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-rose-800">
              Lost Earnings
            </span>
            <span className="block text-sm font-black text-slate-900 truncate select-all">
              {formatCurrency(flow.lostVolume, false)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hourglass(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
