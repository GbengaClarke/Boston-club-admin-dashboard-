// import { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { ShoppingBag, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
// import { AnimatePresence } from "framer-motion";
// import { Pagination } from "../components/Pagination";
// import { OrderRow } from "../orderFeatures/OrderRow";
// import { OrderDetailDrawer } from "../orderFeatures/OrderDetailDrawer";

// import toast from "react-hot-toast";
// import {
//   fetchOrdersApi,
//   updateOrderStatusApi,
//   updateOrderTrackingApi,
// } from "../lib/apiOrders";

// const PAGE_SIZE = 10;
// export const STATUSES = [
//   "pending",
//   "paid",
//   "processing",
//   "shipped",
//   "delivered",
//   "cancelled",
//   "refunded",
// ];

// type SortField = "order_number" | "total_price" | "created_at" | "status";
// type SortDirection = "asc" | "desc";

// export function Orders() {
//   // const queryClient = useQueryClient();
//   const [statusFilter, setStatusFilter] = useState<string>("all");

//   const { allOrders, isLoading, error, updateStatus, updateTracking } =
//     useOrders(statusFilter);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

//   const [sortBy, setSortBy] = useState<SortField>("created_at");
//   const [sortOrder, setSortOrder] = useState<SortDirection>("desc");

//   // Cache key maps strictly to the filtered collection segment
//   const cacheQueryKey = ["orders", { statusFilter }];

//   // --- ⚛️ REACT QUERY: GET BASE DATASET ---
//   // const {
//   //   data: allOrders = [],
//   //   isLoading,
//   //   error,
//   // } = useQuery({
//   //   queryKey: cacheQueryKey,
//   //   queryFn: () => fetchOrdersApi({ statusFilter }),
//   //   placeholderData: (previousData) => previousData,
//   // });

//   // --- 🧠 CLIENT-SIDE CACHE PROCESSING (ZERO DATABASE LATENCY) ---
//   const processedOrders = useMemo(() => {
//     const recordsCopy = [...allOrders];

//     // Local Sorting Logic Engine
//     recordsCopy.sort((a, b) => {
//       let valueA = a[sortBy];
//       let valueB = b[sortBy];

//       // Safe fallback conversion for numeric sorting comparisons
//       if (sortBy === "total_price" || sortBy === "order_number") {
//         return sortOrder === "asc"
//           ? Number(valueA) - Number(valueB)
//           : Number(valueB) - Number(valueA);
//       }

//       // String and Date comparisons
//       valueA = valueA ? String(valueA).toLowerCase() : "";
//       valueB = valueB ? String(valueB).toLowerCase() : "";

//       if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
//       if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
//       return 0;
//     });

//     return recordsCopy;
//   }, [allOrders, sortBy, sortOrder]);

//   // --- ⚡ INSTANT PAGINATION CALCULATION ---
//   const totalOrders = processedOrders.length;
//   const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

//   const paginatedOrders = useMemo(() => {
//     const startIndex = (currentPage - 1) * PAGE_SIZE;
//     return processedOrders.slice(startIndex, startIndex + PAGE_SIZE);
//   }, [processedOrders, currentPage]);

//   const selectedOrder = allOrders.find((o) => o.id === selectedOrderId) || null;

//   // --- 🛠️ MUTATIONS WITH OPTIMISTIC REVALIDATION MAPS ---
//   // const statusMutation = useMutation({
//   //   mutationFn: updateOrderStatusApi,
//   //   onMutate: async ({ id, status }) => {
//   //     await queryClient.cancelQueries({ queryKey: cacheQueryKey });
//   //     const previousOrdersData = queryClient.getQueryData(cacheQueryKey);

//   //     queryClient.setQueryData(cacheQueryKey, (old: any) => {
//   //       if (!old) return old;
//   //       return old.map((order: any) =>
//   //         order.id === id ? { ...order, status } : order
//   //       );
//   //     });

//   //     return { previousOrdersData };
//   //   },
//   //   onError: (err: any, variables, context) => {
//   //     if (context?.previousOrdersData) {
//   //       queryClient.setQueryData(cacheQueryKey, context.previousOrdersData);
//   //     }
//   //     toast.error(err.message || "Failed to update status on server.");
//   //   },
//   //   onSuccess: () => {
//   //     toast.success("Order status synchronized");
//   //   },
//   //   onSettled: () => {
//   //     queryClient.invalidateQueries({ queryKey: cacheQueryKey });
//   //   },
//   // });

//   // const trackingMutation = useMutation({
//   //   mutationFn: updateOrderTrackingApi,
//   //   onMutate: async ({ id, code }) => {
//   //     await queryClient.cancelQueries({ queryKey: cacheQueryKey });
//   //     const previousOrdersData = queryClient.getQueryData(cacheQueryKey);

//   //     queryClient.setQueryData(cacheQueryKey, (old: any) => {
//   //       if (!old) return old;
//   //       return old.map((order: any) =>
//   //         order.id === id
//   //           ? { ...order, tracking_number: code, status: "shipped" }
//   //           : order
//   //       );
//   //     });

//   //     return { previousOrdersData };
//   //   },
//   //   onError: (err: any, variables, context) => {
//   //     if (context?.previousOrdersData) {
//   //       queryClient.setQueryData(cacheQueryKey, context.previousOrdersData);
//   //     }
//   //     toast.error(err.message || "Tracking registration encountered an issue.");
//   //   },
//   //   onSuccess: () => {
//   //     toast.success("Tracking registered");
//   //   },
//   //   onSettled: () => {
//   //     queryClient.invalidateQueries({ queryKey: cacheQueryKey });
//   //   },
//   // });

//   // --- 🔀 DYNAMIC ACTIONS ---
//   const handleSort = (field: SortField) => {
//     if (sortBy === field) {
//       setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//     } else {
//       setSortBy(field);
//       setSortOrder("desc");
//     }
//     setCurrentPage(1); // Return cleanly to frame index 1
//   };

//   const handleFilterChange = (val: string) => {
//     setStatusFilter(val);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const renderSortIndicator = (field: SortField) => {
//     if (sortBy !== field)
//       return (
//         <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300 opacity-60 inline" />
//       );
//     return sortOrder === "asc" ? (
//       <ArrowUp className="w-3 h-3 ml-1 text-indigo-500 inline" />
//     ) : (
//       <ArrowDown className="w-3 h-3 ml-1 text-indigo-500 inline" />
//     );
//   };

//   if (error) {
//     toast.error(
//       (error as any).message ||
//         "An unexpected error occurred during delivery data lookup."
//     );
//   }

//   return (
//     <div className="relative flex flex-col gap-6 min-h-screen">
//       {/* HEADER CONTROLS */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-xl font-bold text-slate-800 tracking-tight">
//             Order Management
//           </h1>
//           <p className="text-sm text-slate-500">
//             Monitor fulfillment metrics, update logistics profiles, and track
//             payments{" "}
//             <span className="font-bold text-slate-700">
//               {totalOrders ? `(${totalOrders} total matched)` : ""}
//             </span>
//           </p>
//         </div>
//         <div className="flex gap-2 w-full sm:w-auto">
//           <select
//             value={statusFilter}
//             onChange={(e) => handleFilterChange(e.target.value)}
//             className="w-full sm:w-auto border border-slate-200 rounded-lg text-xs bg-white py-2 px-3 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="all">All Catalog Orders</option>
//             {STATUSES.map((s) => (
//               <option key={s} value={s}>
//                 {s.toUpperCase()}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* TABLE ELEMENT CONTAINER */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm whitespace-nowrap">
//             <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
//               <tr>
//                 <th
//                   className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
//                   onClick={() => handleSort("order_number")}
//                 >
//                   Reference {renderSortIndicator("order_number")}
//                 </th>
//                 <th className="px-6 py-4">Customer Details</th>
//                 <th
//                   className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
//                   onClick={() => handleSort("total_price")}
//                 >
//                   Financial Total {renderSortIndicator("total_price")}
//                 </th>
//                 <th
//                   className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
//                   onClick={() => handleSort("created_at")}
//                 >
//                   Last Activity {renderSortIndicator("created_at")}
//                 </th>
//                 <th
//                   className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 text-center transition-colors"
//                   onClick={() => handleSort("status")}
//                 >
//                   Pipeline Status {renderSortIndicator("status")}
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {!isLoading &&
//                 paginatedOrders.map((order) => (
//                   <OrderRow
//                     key={order.id}
//                     order={order}
//                     onSelect={() => setSelectedOrderId(order.id)}
//                     onStatusChange={(id, status) =>
//                       statusMutation.mutate({ id, status })
//                     }
//                     onTrackingChange={(id, code) =>
//                       trackingMutation.mutate({ id, code })
//                     }
//                   />
//                 ))}
//             </tbody>
//           </table>

//           {isLoading && (
//             <div className="py-20 flex justify-center items-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//             </div>
//           )}

//           {totalOrders === 0 && !isLoading && (
//             <div className="py-20 text-center flex flex-col items-center justify-center">
//               <ShoppingBag className="w-12 h-12 text-slate-200 mb-4" />
//               <p className="text-slate-400 text-sm">
//                 No recorded structural purchases match this parameter query.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* PAGINATION PANEL FOOTER */}
//         <Pagination
//           totalItems={totalOrders}
//           pageSize={PAGE_SIZE}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//         />
//       </div>

//       {/* DETAILED OVERLAY PANEL DRAWER */}
//       <AnimatePresence>
//         {selectedOrder && (
//           <OrderDetailDrawer
//             order={selectedOrder}
//             onClose={() => setSelectedOrderId(null)}
//             onStatusChange={(id, status) =>
//               statusMutation.mutate({ id, status })
//             }
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { OrderRow } from "../orderFeatures/OrderRow";
import { OrderDetailDrawer } from "../orderFeatures/OrderDetailDrawer";

import toast from "react-hot-toast";
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
];

type SortField = "order_number" | "total_price" | "created_at" | "status";
type SortDirection = "asc" | "desc";

export function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Hook handles our server interaction cleanly
  const { allOrders, isLoading, error, updateStatus, updateTracking } =
    useOrders(statusFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortDirection>("desc");

  // --- 🧠 CLIENT-SIDE CACHE PROCESSING ---
  const processedOrders = useMemo(() => {
    const recordsCopy = [...allOrders];

    recordsCopy.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (sortBy === "total_price" || sortBy === "order_number") {
        return sortOrder === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      valueA = valueA ? String(valueA).toLowerCase() : "";
      valueB = valueB ? String(valueB).toLowerCase() : "";

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return recordsCopy;
  }, [allOrders, sortBy, sortOrder]);

  // --- ⚡ INSTANT PAGINATION CALCULATION ---
  const totalOrders = processedOrders.length;

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return processedOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [processedOrders, currentPage]);

  const selectedOrder = allOrders.find((o) => o.id === selectedOrderId) || null;

  // --- 🔀 DYNAMIC ACTIONS ---
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field)
      return (
        <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300 opacity-60 inline" />
      );
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1 text-indigo-500 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-indigo-500 inline" />
    );
  };

  if (error) {
    toast.error(
      (error as any).message ||
        "An unexpected error occurred during delivery data lookup."
    );
  }

  return (
    <div className="relative flex flex-col gap-6 min-h-screen">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-slate-500">
            Monitor fulfillment metrics, update logistics profiles, and track
            payments{" "}
            <span className="font-bold text-slate-700">
              {totalOrders ? `(${totalOrders} total matched)` : ""}
            </span>
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-lg text-xs bg-white py-2 px-3 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Catalog Orders</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE ELEMENT CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
              <tr>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  onClick={() => handleSort("order_number")}
                >
                  Reference {renderSortIndicator("order_number")}
                </th>
                <th className="px-6 py-4">Customer Details</th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  onClick={() => handleSort("total_price")}
                >
                  Financial Total {renderSortIndicator("total_price")}
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  Last Activity {renderSortIndicator("created_at")}
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 text-center transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Pipeline Status {renderSortIndicator("status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading &&
                paginatedOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onSelect={() => setSelectedOrderId(order.id)}
                    /* FIXED: Replaced statusMutation.mutate with updateStatus */
                    onStatusChange={(id, status) =>
                      updateStatus({ id, status })
                    }
                    /* FIXED: Replaced trackingMutation.mutate with updateTracking */
                    onTrackingChange={(id, code) =>
                      updateTracking({ id, code })
                    }
                  />
                ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {totalOrders === 0 && !isLoading && (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm">
                No recorded structural purchases match this parameter query.
              </p>
            </div>
          )}
        </div>

        {/* PAGINATION PANEL FOOTER */}
        <Pagination
          totalItems={totalOrders}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* DETAILED OVERLAY PANEL DRAWER */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrderId(null)}
            /* FIXED: Replaced statusMutation.mutate with updateStatus */
            onStatusChange={(id, status) => updateStatus({ id, status })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
