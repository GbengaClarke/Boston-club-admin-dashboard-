import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Loader2, Info } from "lucide-react";
import { Link } from "react-router-dom";
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

  const filteredOrders = orders.filter(
    (order: any) => new Date(order.created_at) >= cutoff
  );

  const pageSize = 5;
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));

  const startIndex = (activePage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* HEADER CONTROLS */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Recent Activity — Past {daysRange} Days
        </h3>
        <span className="text-xs bg-slate-100 font-bold px-2.5 py-0.5 text-slate-700 rounded-full self-start sm:self-auto">
          {totalItems} records
        </span>
      </div>

      {/* ADVISORY INFO BANNER */}
      <div className="mx-4 sm:mx-5 mb-5 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-700 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-indigo-950 leading-relaxed">
          Need to manage, track, or modify these records? The full interactive
          registry with status transitions, sorting, and logistics controls is
          available on the{" "}
          <Link
            to="/orders"
            className="font-bold underline text-indigo-700 hover:text-indigo-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1 whitespace-nowrap"
          >
            Orders Page &rarr;
          </Link>
        </p>
      </div>

      {/* TABLE DATA ENTRY ARCHITECTURE */}
      <div className="w-full overflow-x-auto scrolling-touch mt-2">
        <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
          <thead>
            <tr className="bg-slate-50 text-slate-900 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
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
                  className="text-center py-8 text-slate-600 text-sm font-medium"
                >
                  No transactions match within this timeline parameter.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order: any) => {
                const badge = ORDER_STATUS_CONFIG[
                  order.status as OrderStatus
                ] || {
                  className: "bg-slate-100 text-slate-700 border-slate-200",
                  label: order.status,
                };
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3.5 font-mono font-bold text-slate-900 text-xs">
                      #BC-{order.order_number}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex flex-col max-w-[180px] sm:max-w-none">
                        <span className="font-semibold text-slate-900 text-sm truncate capitalize">
                          {order.profiles?.full_name || "Guest User"}
                        </span>
                        <span className="text-xs font-medium text-slate-600 truncate mt-0.5">
                          {order.profiles?.email || "No verified info"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-700 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        <span className="font-medium">
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

      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={activePage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
