// import { motion } from "framer-motion";
// import { X, ShieldCheck, Mail, MapPin, Layers } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "../lib/supabase";
// import { cn, formatCurrency } from "../lib/utils";

// interface OrderDetailDrawerProps {
//   order: any;
//   onClose: () => void;
//   onStatusChange: (id: string, status: string) => void;
// }

// export function OrderDetailDrawer({
//   order,
//   onClose,
//   onStatusChange,
// }: OrderDetailDrawerProps) {
//   console.log(order);
//   // TanStack React Query replacing the manual useEffect structure
//   const {
//     data: items = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["order_items", order?.id],
//     queryFn: async () => {
//       if (!supabase || !order?.id) return [];

//       const { data, error } = await supabase
//         .from("order_items")
//         .select(
//           `
//           id, quantity, unit_price,
//           products (name, category, material),
//           product_images (color_name)
//         `
//         )
//         .eq("order_id", order.id);

//       if (error) throw error;
//       return data || [];
//     },
//     // The query will not execute if there is no stable order ID
//     enabled: !!order?.id,
//     // Helps maintain visual state stability during the AnimatePresence unmount
//     staleTime: 5000,
//   });

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
//       {/* Backdrop */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.4 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
//       />

//       {/* Sliding Frame Drawer */}
//       <motion.div
//         initial={{ x: "100%" }}
//         animate={{ x: 0 }}
//         exit={{ x: "100%" }}
//         transition={{ type: "tween", duration: 0.3 }}
//         className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
//       >
//         {/* Header Block */}
//         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//           <div>
//             <div className="flex items-center gap-2">
//               <h2 className="text-base font-bold text-slate-900">
//                 Order #BC-{order?.order_number || ""}
//               </h2>
//               <span className="text-[10px] bg-slate-200/80 text-slate-600 font-bold px-2 py-0.5 rounded-md font-mono uppercase">
//                 {order.status}
//               </span>
//             </div>
//             {/* <p className="text-xs text-slate-400 mt-0.5 font-mono">
//               ID: {order?.id || ""}
//             </p> */}
//           </div>

//           <button
//             onClick={onClose}
//             className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Dynamic Structural Summary Body */}
//         <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
//           {/* Section 1: Customer Profile Details */}
//           <div className="flex flex-col gap-2.5">
//             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
//               <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Customer
//               Information
//             </h3>
//             <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-700 flex flex-col gap-2">
//               <p className="font-bold text-slate-900 text-sm">
//                 {order?.customers?.full_name || "Ordering Customer"}
//               </p>
//               <p className="flex items-center gap-2 text-slate-500 font-mono">
//                 <Mail className="w-3.5 h-3.5" />{" "}
//                 {order?.customers?.email || "No account connection"}
//               </p>
//               <div className="flex items-start gap-2 text-slate-600 border-t border-slate-200/60 pt-2 mt-1">
//                 <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
//                 <span className="leading-relaxed">
//                   {order?.shipping_address
//                     ? typeof order.shipping_address === "string"
//                       ? order.shipping_address
//                       : JSON.stringify(order.shipping_address)
//                     : "No address payload logged for this transaction entry."}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Section 2: Product Line Contents */}
//           <div className="flex flex-col gap-2.5">
//             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
//               <Layers className="w-3.5 h-3.5 text-indigo-500" /> Itemized
//               Packages
//             </h3>

//             {isLoading ? (
//               <div className="py-8 flex justify-center">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
//               </div>
//             ) : isError ? (
//               <div className="py-4 text-center text-xs text-red-500 font-medium bg-red-50 rounded-xl border border-red-100 p-3">
//                 Failed to parse layout configuration or fetch operational line
//                 items.
//               </div>
//             ) : (
//               <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
//                 {items.map((item: any) => (
//                   <div
//                     key={item.id}
//                     className="p-4 flex justify-between items-start text-xs bg-slate-50/20 hover:bg-slate-50/50 transition-colors"
//                   >
//                     <div className="flex flex-col gap-0.5">
//                       <span className="font-bold text-slate-800 text-sm">
//                         {item.products?.name}
//                       </span>
//                       <span className="text-slate-400 capitalize text-[11px]">
//                         Category: {item.products?.category} | Mat:{" "}
//                         {item.products?.material}
//                       </span>
//                       <span className="inline-flex items-center mt-1 font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] w-fit">
//                         {item.product_images?.color_name || "Base"}
//                       </span>
//                     </div>
//                     <div className="text-right flex flex-col justify-between h-full items-end">
//                       <span className="font-bold text-slate-900">
//                         {formatCurrency
//                           ? formatCurrency(item.unit_price)
//                           : `₦${item.unit_price}`}
//                       </span>
//                       <span className="text-[10px] text-slate-400 mt-1">
//                         Qty: x{item.quantity}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Fixed Receipt Ledger Action Bottom Block */}
//         <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4 shadow-inner">
//           <div className="flex justify-between items-center">
//             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
//               Total Receipt Value
//             </span>
//             <span className="text-lg font-black text-indigo-600 font-mono">
//               {formatCurrency && order?.total_price
//                 ? formatCurrency(order.total_price)
//                 : `₦${order?.total_price || 0}`}
//             </span>
//           </div>

//           <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 bg-white p-3 rounded-lg border border-slate-200 font-mono">
//             <div className="flex justify-between">
//               <span>Initialized order:</span>
//               <span>
//                 {order?.created_at
//                   ? new Date(order.created_at).toLocaleString()
//                   : ""}
//               </span>
//             </div>
//             <div className="flex justify-between text-slate-600 font-semibold border-t border-slate-100 pt-1.5 mt-1">
//               <span>Last activity:</span>
//               <span>
//                 {order?.updated_at
//                   ? new Date(order.updated_at).toLocaleString()
//                   : ""}
//               </span>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { motion } from "framer-motion";
import { X, ShieldCheck, Mail, MapPin, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { cn, formatCurrency } from "../lib/utils";
import { ORDER_STATUS_CONFIG } from "../types/ProductTypes";

interface OrderDetailDrawerProps {
  order: any;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export function OrderDetailDrawer({
  order,
  onClose,
  onStatusChange,
}: OrderDetailDrawerProps) {
  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order_items", order?.id],
    queryFn: async () => {
      if (!supabase || !order?.id) return [];

      const { data, error } = await supabase
        .from("order_items")
        .select(
          `
          id, quantity, unit_price,
          products (name, category, material),
          product_images (color_name)
        `
        )
        .eq("order_id", order.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!order?.id,
    staleTime: 5000,
  });

  // Extract shared state styling parameters safely for the header block badge
  const currentStatusConfig = ORDER_STATUS_CONFIG[order?.status] || {
    className: "bg-slate-200 text-slate-600 border-slate-300",
    label: order?.status || "",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Sliding Frame Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
      >
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Order #BC-{order?.order_number || ""}
              </h2>
              {/* Refactored Status Badge utilizing our centralized config design tokens */}
              <span
                className={cn(
                  "text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono uppercase tracking-wider shadow-sm",
                  currentStatusConfig.className
                )}
              >
                {currentStatusConfig.label}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Structural Summary Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Section 1: Customer Profile Details */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Customer
              Information
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-700 flex flex-col gap-2">
              <p className="font-bold text-slate-900 text-sm">
                {order?.customers?.full_name || "Ordering Customer"}
              </p>
              <p className="flex items-center gap-2 text-slate-500 font-mono">
                <Mail className="w-3.5 h-3.5" />{" "}
                {order?.customers?.email || "No account connection"}
              </p>
              <div className="flex items-start gap-2 text-slate-600 border-t border-slate-200/60 pt-2 mt-1">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                <span className="leading-relaxed">
                  {order?.shipping_address
                    ? typeof order.shipping_address === "string"
                      ? order.shipping_address
                      : JSON.stringify(order.shipping_address)
                    : "No address payload logged for this transaction entry."}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Product Line Contents */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Itemized
              Packages
            </h3>

            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
              </div>
            ) : isError ? (
              <div className="py-4 text-center text-xs text-red-500 font-medium bg-red-50 rounded-xl border border-red-100 p-3">
                Failed to parse layout configuration or fetch operational line
                items.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-4 flex justify-between items-start text-xs bg-slate-50/20 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800 text-sm">
                        {item.products?.name}
                      </span>
                      <span className="text-slate-400 capitalize text-[11px]">
                        Category: {item.products?.category} | Mat:{" "}
                        {item.products?.material}
                      </span>
                      <span className="inline-flex items-center mt-1 font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] w-fit">
                        {item.product_images?.color_name || "Base"}
                      </span>
                    </div>
                    <div className="text-right flex flex-col justify-between h-full items-end">
                      <span className="font-bold text-slate-900">
                        {formatCurrency
                          ? formatCurrency(item.unit_price)
                          : `₦${item.unit_price}`}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        Qty: x{item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Receipt Ledger Action Bottom Block */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4 shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Receipt Value
            </span>
            <span className="text-lg font-black text-indigo-600 font-mono">
              {formatCurrency && order?.total_price
                ? formatCurrency(order.total_price)
                : `₦${order?.total_price || 0}`}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 bg-white p-3 rounded-lg border border-slate-200 font-mono">
            <div className="flex justify-between">
              <span>Initialized order:</span>
              <span>
                {order?.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : ""}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 font-semibold border-t border-slate-100 pt-1.5 mt-1">
              <span>Last activity:</span>
              <span>
                {order?.updated_at
                  ? new Date(order.updated_at).toLocaleString()
                  : ""}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
