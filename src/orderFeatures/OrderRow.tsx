import { motion } from "framer-motion";
import { Package, Truck, Calendar } from "lucide-react";
import { cn, formatCurrency } from "../lib/utils";
import { STATUSES } from "../pages/Orders";

interface OrderRowProps {
  order: any;
  onSelect: () => void;
  onStatusChange: (id: string, status: string) => void;
  onTrackingChange: (id: string, code: string) => void;
}

export function OrderRow({
  order,
  onSelect,
  onStatusChange,
  onTrackingChange,
}: OrderRowProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const formattedLastUpdate = new Date(order.updated_at).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <motion.tr
      onClick={onSelect}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="transition-colors group border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer"
    >
      {/* REFERENCE */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            #BC-{order.order_number}
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase flex items-center gap-1 mt-0.5">
            <Calendar className="w-2.5 h-2.5" /> {formattedDate}
          </span>
        </div>
      </td>

      {/* CUSTOMER PROFILE */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {order.customers?.full_name || "Anonymous Purchaser"}
          </span>
          <span className="text-[10px] text-slate-400 font-mono max-w-[180px] truncate">
            {order.customers?.email || "No credential email tied"}
          </span>
        </div>
      </td>

      {/* FINANCIAL DATA */}
      <td className="px-6 py-4">
        <span className="font-bold text-slate-900 font-mono">
          {formatCurrency
            ? formatCurrency(order.total_price)
            : `₦${order.total_price.toLocaleString()}`}
        </span>
      </td>

      {/* CARRIER TRACKING CONFIG */}
      {/* <td className="px-6 py-4 text-xs font-mono">
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className={cn(
              "text-slate-600",
              !order.tracking_number && "text-slate-300 italic text-[11px]"
            )}
          >
            {order.tracking_number || "Unassigned"}
          </span>
          <button
            type="button"
            onClick={() => {
              const code = prompt(
                "Enter courier tracking value identifier:",
                order.tracking_number || ""
              );
              if (code !== null) onTrackingChange(order.id, code.trim());
            }}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
            title="Modify Logistics Code"
          >
            <Truck className="w-3.5 h-3.5" />
          </button>
        </div>
      </td> */}

      {/* LAST SYSTEM REFRESH ROW */}
      <td className="px-6 py-4 text-xs font-medium text-slate-500">
        <div className="flex flex-col">
          <span>{new Date(order.updated_at).toLocaleDateString()}</span>
          <span className="text-[10px] text-slate-400">
            {formattedLastUpdate}
          </span>
        </div>
      </td>

      {/* INTERACTIVE PIPELINE SELECTOR */}
      <td
        className="px-6 py-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value)}
          className={cn(
            "px-2.5 py-1 text-[10px] font-bold rounded-full uppercase border focus:outline-none appearance-none cursor-pointer w-36 text-center shadow-sm transition-all",
            order.status === "delivered" &&
              "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100",
            order.status === "pending" &&
              "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
            order.status === "cancelled" &&
              "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100",
            ["shipped", "processing"].includes(order.status) &&
              "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
          )}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </td>
    </motion.tr>
  );
}
