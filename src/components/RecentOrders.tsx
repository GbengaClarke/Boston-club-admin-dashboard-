import { useQuery } from "@tanstack/react-query";
import { Calendar, Loader2 } from "lucide-react";
import { fetchOrdersApi } from "../lib/apiOrders";
import { ORDER_STATUS_CONFIG, OrderStatus } from "../types/ProductTypes";
import { formatCurrency } from "../lib/utils";

export function RecentOrders({ daysRange }: { daysRange: number }) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => fetchOrdersApi({ statusFilter: "all" }),
  });

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysRange);

  const filteredOrders = orders
    .filter((order: any) => new Date(order.created_at) >= cutoff)
    .slice(0, 10);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Recent Activity — Past {daysRange} Days
        </h3>
        <span className="text-xs bg-slate-100 font-semibold px-2.5 py-0.5 text-slate-600 rounded-full self-start sm:self-auto">
          {filteredOrders.length} records
        </span>
      </div>

      {/* SWIPE CONTAINER FOR TOUCH INFRASTRUCTURES */}
      <div className="w-full overflow-x-auto scrolling-touch">
        <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
              <th className="px-4 sm:px-6 py-3">Order</th>
              <th className="px-4 sm:px-6 py-3">Customer</th>
              <th className="px-4 sm:px-6 py-3">Created</th>
              <th className="px-4 sm:px-6 py-3">Fulfillment</th>
              <th className="px-4 sm:px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-slate-400 text-xs"
                >
                  No transactions match within this timeline parameter.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: any) => {
                const badge = ORDER_STATUS_CONFIG[
                  order.status as OrderStatus
                ] || {
                  className: "bg-slate-50 text-slate-600",
                  label: order.status,
                };
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3.5 font-mono font-bold text-slate-900 text-xs">
                      #BC-{order.order_number}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex flex-col max-w-[180px] sm:max-w-none">
                        <span className="font-semibold text-slate-800 text-xs truncate">
                          {order.profiles?.full_name || "Guest User"}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          {order.profiles?.email || "No verified info"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatCurrency(order.total_price, true)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
