import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { OrderRow } from "../orderFeatures/OrderRow";
import { OrderDetailDrawer } from "../orderFeatures/OrderDetailDrawer";
import { useOrders } from "../orderFeatures/useOrders";

const PAGE_SIZE = 10;

export const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

// Added 'customer_name' to SortField
type SortField =
  | "order_number"
  | "total_price"
  | "created_at"
  | "status"
  | "customer_name";
type SortDirection = "asc" | "desc";

export function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const {
    allOrders = [],
    isLoading,
    error,
    updateStatus,
    updateTracking,
  } = useOrders(statusFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortDirection>("desc");

  const processedOrders = useMemo(() => {
    return [...allOrders].sort((a, b) => {
      const valA =
        sortBy === "customer_name" ? (a as any).profiles?.full_name : a[sortBy];
      const valB =
        sortBy === "customer_name" ? (b as any).profiles?.full_name : b[sortBy];

      if (sortBy === "total_price" || sortBy === "order_number") {
        return sortOrder === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      const strA = String(valA ?? "").toLowerCase();
      const strB = String(valB ?? "").toLowerCase();

      return sortOrder === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [allOrders, sortBy, sortOrder]);

  const totalOrders = processedOrders.length;
  const paginatedOrders = processedOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const selectedOrder = useMemo(
    () => allOrders.find((o) => o.id === selectedOrderId) || null,
    [allOrders, selectedOrderId]
  );

  const handleSort = (field: SortField) => {
    setSortOrder(sortBy === field && sortOrder === "desc" ? "asc" : "desc");
    setSortBy(field);
    setCurrentPage(1);
  };

  const renderSortIndicator = (field: SortField) => (
    <span className="inline-flex items-center ml-1 shrink-0">
      {sortBy !== field ? (
        <ArrowUpDown className="w-3 h-3 text-slate-400" />
      ) : sortOrder === "asc" ? (
        <ArrowUp className="w-3 h-3 text-indigo-600" />
      ) : (
        <ArrowDown className="w-3 h-3 text-indigo-600" />
      )}
    </span>
  );

  return (
    <div className="relative flex flex-col gap-6 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-5 justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-slate-500">
            Monitor fulfillment metrics and track payments.{" "}
            <span className="font-bold text-slate-700">
              {totalOrders ? `(${totalOrders} orders)` : ""}
            </span>
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-slate-300 rounded-lg text-sm bg-white py-2 px-3 font-semibold text-slate-700 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All Orders</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE*/}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-900 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
              <tr>
                {[
                  { label: "Reference", field: "order_number" },
                  { label: "Customer Details", field: "customer_name" },
                  { label: "Financial Total", field: "total_price" },
                  { label: "Last Activity", field: "created_at" },
                  { label: "Pipeline Status", field: "status" },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className="px-6 py-4 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort(field as SortField)}
                  >
                    <div className="flex items-center">
                      {label} {renderSortIndicator(field as SortField)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading &&
                paginatedOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onSelect={() => setSelectedOrderId(order.id)}
                    onStatusChange={(id, status) =>
                      updateStatus({ id, status })
                    }
                    onTrackingChange={(id, code) =>
                      updateTracking?.({ id, code })
                    }
                  />
                ))}
            </tbody>
          </table>
        </div>

        {isLoading && (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {totalOrders === 0 && !isLoading && (
          <div className="py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">No orders found.</p>
          </div>
        )}

        <Pagination
          totalItems={totalOrders}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrderId(null)}
            onStatusChange={(id, status) => updateStatus({ id, status })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
