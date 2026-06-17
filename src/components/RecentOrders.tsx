import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Loader2, Info } from "lucide-react";
import { Link } from "react-router-dom"; // Assumed router interface is available
import { fetchOrdersApi } from "../lib/apiOrders";
import { ORDER_STATUS_CONFIG, OrderStatus } from "../types/ProductTypes";
import { formatCurrency } from "../lib/utils";
import { Pagination } from "./Pagination";

export function RecentOrders({ daysRange }: { daysRange: number }) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => fetchOrdersApi({ statusFilter: "all" }),
  });

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysRange);

  // Filter the orders globally matching the current timeframe window
  const filteredOrders = orders.filter(
    (order: any) => new Date(order.created_at) >= cutoff
  );

  // Pagination parameters
  const pageSize = 5;
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Purely clamp the page to ensure we never get stranded on an empty page when changing daysRange
  const activePage = Math.min(currentPage, Math.max(1, totalPages));

  // Determine slice indices
  const startIndex = (activePage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* HEADER CONTROLS */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Recent Activity — Past {daysRange} Days
        </h3>
        <span className="text-xs bg-slate-100 font-semibold px-2.5 py-0.5 text-slate-600 rounded-full self-start sm:self-auto">
          {totalItems} records
        </span>
      </div>

      {/* ADVISORY INFO BANNER FOR ADVANCED INTERACTIONS */}
      <div className="mx-4 sm:mx-5 mb-5 p-3.5 bg-indigo-50/50 border border-indigo-100/80 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-indigo-800/95 leading-relaxed">
          Need to manage, track, or modify these records? The full interactive
          registry with status transitions, sorting, and logistics controls is
          available on the{" "}
          <Link
            to="/orders"
            className="font-bold underline hover:text-indigo-900 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
          >
            Orders Page &rarr;
          </Link>
        </p>
      </div>

      {/* SWIPE CONTAINER FOR TOUCH INFRASTRUCTURES */}
      <div className="w-full overflow-x-auto scrolling-touch mt-2">
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
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-slate-400 text-xs"
                >
                  No transactions match within this timeline parameter.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order: any) => {
                const badge = ORDER_STATUS_CONFIG[
                  order.status as OrderStatus
                ] || {
                  className: "bg-slate-50 text-slate-600",
                  label: order.status,
                };
                return (
                  <tr key={order.id} className=" transition-colors">
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
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full border  ${badge.className}`}
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

      {/* PAGINATION NAVIGATION ELEMENT */}
      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={activePage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
