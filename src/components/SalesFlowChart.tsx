// src/components/SalesFlowChart.tsx
import React from "react";
import {
  ArrowRight,
  ArrowDown,
  Wallet,
  CheckCircle,
  Hourglass,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "../lib/utils";

interface SalesFlowChartProps {
  flow: {
    grossBooked: number;
    finalizedRevenue: number;
    heldInPipeline: number;
    lostVolume: number;
  };
}

export function SalesFlowChart({ flow }: SalesFlowChartProps) {
  const segments = [
    {
      label: "Gross Booked Volume",
      amount: flow.grossBooked,
      icon: Wallet,
      color: "bg-slate-50 border-slate-200 text-slate-700 font-mono",
    },
    {
      label: "Finalized Revenue",
      amount: flow.finalizedRevenue,
      icon: CheckCircle,
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      label: "Held in Pipeline",
      amount: flow.heldInPipeline,
      icon: Hourglass,
      color: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      label: "Lost Volume",
      amount: flow.lostVolume,
      icon: XCircle,
      color: "bg-rose-50 border-rose-200 text-rose-700",
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Monetary Sales Flow
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Financial health breakdown tracking Nigerian Naira flow from invoice
          bookings to settlement.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-2 pt-2">
        {segments.map((node, idx) => {
          const isFirst = idx === 0;
          return (
            <React.Fragment key={node.label}>
              {/* Connector from Gross Booked to the destination channels */}
              {!isFirst && idx === 1 && (
                <div className="flex items-center justify-center text-slate-300 flex-shrink-0 my-1 lg:my-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:block mr-2">
                    Splits into →
                  </span>
                  <ArrowDown className="w-4 h-4 block lg:hidden text-slate-400" />
                </div>
              )}
              {idx > 1 && (
                <div className="flex items-center justify-center text-slate-300 flex-shrink-0 block lg:hidden">
                  <ArrowDown className="w-4 h-4 text-slate-400" />
                </div>
              )}

              <div
                className={`w-full lg:flex-1 border p-4 rounded-xl flex lg:flex-col items-center justify-between lg:justify-center text-center gap-3 relative transition-all hover:shadow-sm ${node.color}`}
              >
                <div className="p-2 bg-white rounded-lg border border-inherit flex-shrink-0">
                  <node.icon className="w-4 h-4" />
                </div>
                <div className="text-left lg:text-center min-w-0 flex-1 lg:flex-none">
                  <p className="text-[10px] font-bold uppercase opacity-70 tracking-tight truncate">
                    {node.label}
                  </p>
                  <h4 className="text-sm sm:text-base font-black mt-0.5 truncate select-all">
                    {formatCurrency(node.amount, false)}
                  </h4>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
