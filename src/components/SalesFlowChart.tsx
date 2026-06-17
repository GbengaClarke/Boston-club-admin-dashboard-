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
  // Convert our raw analytics flow keys into a structure Recharts can chart directly
  const data = [
    {
      name: `Past ${daysRange} Days`,
      "Cancelled/Lost": flow.lostVolume,
      "Cleared Earnings": flow.finalizedRevenue,
      "Held in Pipeline": flow.heldInPipeline,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Revenue Performance Pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualization of how incoming booked invoice values filter into
            finalized cash.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg select-all">
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
              stroke="#F1F5F9"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              tickFormatter={(value) => formatCurrency(value, false)}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748B", fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                fontSize: "12px",
              }}
              formatter={(value: number) => [formatCurrency(value, false)]}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconSize={10}
              iconType="circle"
              wrapperStyle={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#475569",
              }}
            />
            {/* Cleared Funds Stack Segment */}
            <Bar
              dataKey="Cleared Earnings"
              stackId="revenue"
              fill="#10B981"
              radius={[0, 0, 0, 0]}
              barSize={44}
            />
            {/* Pending Pipeline Stack Segment */}
            <Bar
              dataKey="Held in Pipeline"
              stackId="revenue"
              fill="#6366F1"
              radius={[0, 0, 0, 0]}
            />
            {/* Cancelled/Lost Stack Segment */}
            <Bar
              dataKey="Cancelled/Lost"
              stackId="revenue"
              fill="#F43F5E"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* METRIC CARD GRID INSERTS UNDER CHART */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
        <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Cleared Cash
            </span>
            <span className="block text-sm font-extrabold text-slate-800 truncate select-all">
              {formatCurrency(flow.finalizedRevenue, false)}
            </span>
          </div>
        </div>

        <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg flex items-center gap-3">
          <Hourglass className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Held in Transit
            </span>
            <span className="block text-sm font-extrabold text-slate-800 truncate select-all">
              {formatCurrency(flow.heldInPipeline, false)}
            </span>
          </div>
        </div>

        <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Lost Earnings
            </span>
            <span className="block text-sm font-extrabold text-slate-800 truncate select-all">
              {formatCurrency(flow.lostVolume, false)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal auxiliary component matching icon mapping inside container helper layout grid
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
