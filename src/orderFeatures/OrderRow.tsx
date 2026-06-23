import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { cn, formatCurrency } from "../lib/utils";
import { ORDER_STATUS_CONFIG, STATUSES } from "../types/ProductTypes";

interface OrderRowProps {
  order: any;
  onSelect: () => void;
  disabled?: boolean;
  onStatusChange: (id: string, status: string) => void;
  onTrackingChange: (id: string, code: string) => void;
}

export function OrderRow({
  order,
  onSelect,
  disabled,
  onStatusChange,
}: OrderRowProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const currentStatusConfig = ORDER_STATUS_CONFIG[order.status] || {
    className: "bg-slate-100 text-slate-700 border-slate-200",
    label: order.status,
  };

  return (
    <motion.tr
      onClick={onSelect}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "transition-colors group border-b border-slate-200/80",
        disabled
          ? "bg-slate-50/50 cursor-not-allowed"
          : "hover:bg-slate-500/15 cursor-pointer"
      )}
    >
      {/* REFERENCE */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-950 text-sm group-hover:text-indigo-700 transition-colors">
            #BC-{order.order_number}
          </span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" /> {formattedDate}
          </span>
        </div>
      </td>

      {/* CUSTOMER PROFILE */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 capitalize text-sm">
            {order.profiles?.full_name || "Anonymous Purchaser"}
          </span>
          <span className="text-xs font-medium text-slate-600 truncate max-w-[180px] mt-0.5">
            {order.profiles?.email || "No email provided"}
          </span>
        </div>
      </td>

      {/* FINANCIAL DATA */}
      <td className="px-6 py-4">
        <span className="font-extrabold text-slate-950 text-sm">
          {formatCurrency
            ? formatCurrency(order.total_price)
            : `₦${order.total_price.toLocaleString()}`}
        </span>
      </td>

      {/* LAST SYSTEM REFRESH */}
      <td className="px-6 py-4">
        <div className="flex flex-col text-xs font-semibold text-slate-900">
          <span>{new Date(order.updated_at).toLocaleDateString()}</span>
          <span className="text-slate-500 font-normal">
            {new Date(order.updated_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </td>

      {/* INTERACTIVE PIPELINE SELECTOR */}
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value)}
          className={cn(
            "px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-lg border focus:ring-1 focus:ring-indigo-500/20 focus:outline-none appearance-none cursor-pointer w-32 shadow-sm transition-all",
            currentStatusConfig.className
          )}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_CONFIG[s]?.label || s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </td>
    </motion.tr>
  );
}
