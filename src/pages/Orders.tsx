// import React, { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { cn } from '../lib/utils';
// import { motion } from 'motion/react';
// import { Package, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

// const STATUSES = [
//   'payment_pending',
//   'order_confirmed',
//   'production_in_progress',
//   'ready_to_ship',
//   'shipped',
//   'delivered'
// ];

// export function Orders() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState<string>('all');

//   const fetchOrders = async () => {
//     setLoading(true);
//     if (!supabase) return;

//     let query = supabase
//       .from('orders')
//       .select('*, customers(full_name, email)')
//       .order('created_at', { ascending: false });

//     if (statusFilter !== 'all') {
//       query = query.eq('status', statusFilter);
//     }

//     const { data, error } = await query;
//     if (error) console.error(error);
//     if (data) setOrders(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [statusFilter]);

//   const updateStatus = async (id: string, newStatus: string) => {
//     if (!supabase) return;
//     const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
//     if (error) alert(error.message);
//     fetchOrders();
//   };

//   const toggleVerification = async (id: string, currentStatus: boolean) => {
//     if (!supabase) return;
//     const { error } = await supabase
//       .from('orders')
//       .update({
//         admin_verified: !currentStatus,
//         paid_at: !currentStatus ? new Date().toISOString() : null
//       })
//       .eq('id', id);

//     if (error) alert(error.message);
//     fetchOrders();
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-xl font-bold text-slate-800">Order Management</h1>
//           <p className="text-sm text-slate-500">Manage manual payment verification and fulfillment</p>
//         </div>
//         <div className="flex gap-2">
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="border-slate-200 rounded-lg text-sm bg-white"
//           >
//             <option value="all">All Orders</option>
//             {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
//           </select>
//         </div>
//       </div>

//       <div className="glass-card overflow-hidden">
//         {loading ? (
//           <div className="p-12 flex justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : orders.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm whitespace-nowrap">
//               <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
//                 <tr>
//                   <th className="px-6 py-4">Reference</th>
//                   <th className="px-6 py-4">Details</th>
//                   <th className="px-6 py-4">Customer</th>
//                   <th className="px-6 py-4">Verification</th>
//                   <th className="px-6 py-4">Total</th>
//                   <th className="px-6 py-4">Tracking</th>
//                   <th className="px-6 py-4 text-center">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {orders.map((order) => (
//                   <motion.tr
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     key={order.id}
//                     className="hover:bg-slate-50/50 transition-colors"
//                   >
//                     <td className="px-6 py-4 font-medium text-slate-900">
//                       <div className="flex flex-col">
//                         <span className="text-xs font-bold">{order.payment_reference || order.id.slice(0, 8)}</span>
//                         <span className="text-[10px] text-slate-400 uppercase">{new Date(order.created_at).toLocaleDateString()}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col gap-1 text-[10px]">
//                         {order.whatsapp_reference && (
//                           <a href={`https://wa.me/${order.whatsapp_reference}?text=Regarding order ${order.payment_reference}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 font-bold hover:underline">
//                             <ExternalLink className="w-3 h-3" /> WhatsApp
//                           </a>
//                         )}
//                         {order.payment_proof_url && (
//                           <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 font-bold hover:underline">
//                             <ExternalLink className="w-3 h-3" /> Proof of Payment
//                           </a>
//                         )}
//                         {!order.whatsapp_reference && !order.payment_proof_url && (
//                           <span className="text-slate-400">No additional details</span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col">
//                         <span className="text-slate-900 font-medium">{order.customers?.full_name || 'Anonymous'}</span>
//                         <span className="text-xs text-slate-400">{order.customers?.email || order.customer_id}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => toggleVerification(order.id, order.admin_verified)}
//                         className={cn(
//                           "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors",
//                           order.admin_verified
//                             ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
//                             : "bg-amber-100 text-amber-700 hover:bg-amber-200"
//                         )}
//                       >
//                         {order.admin_verified ? (
//                           <><CheckCircle2 className="w-3 h-3" /> Paid</>
//                         ) : (
//                           <><XCircle className="w-3 h-3" /> Pending</>
//                         )}
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 font-bold text-slate-900">${order.total_amount?.toFixed(2)}</td>
//                     <td className="px-6 py-4 text-slate-500 font-mono text-xs uppercase">
//                       <div className="flex items-center gap-2">
//                         {order.tracking_code || 'Pending...'}
//                         <button
//                           onClick={() => {
//                             const newTracking = prompt('Enter new tracking code:', order.tracking_code || '');
//                             if (newTracking !== null) {
//                               supabase?.from('orders').update({ tracking_code: newTracking, status: 'shipped' }).eq('id', order.id).then(() => fetchOrders());
//                             }
//                           }}
//                           className="text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors"
//                           title="Update Tracking"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
//                         </button>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <select
//                         value={order.status}
//                         onChange={(e) => updateStatus(order.id, e.target.value)}
//                         className={cn(
//                           "px-2 py-1 text-xs font-bold rounded-md uppercase border focus:outline-none appearance-none cursor-pointer w-40 text-center",
//                           order.status === 'delivered' && "bg-emerald-50 text-emerald-600 border-emerald-100",
//                           order.status === 'production_in_progress' && "bg-indigo-50 text-indigo-600 border-indigo-100",
//                           (order.status === 'shipped' || order.status === 'ready_to_ship') && "bg-blue-50 text-blue-600 border-blue-100",
//                           order.status === 'payment_pending' && "bg-rose-50 text-rose-600 border-rose-100",
//                           order.status === 'order_confirmed' && "bg-slate-50 text-slate-600 border-slate-200"
//                         )}
//                       >
//                         {STATUSES.map(s => (
//                           <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
//                         ))}
//                       </select>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-12 text-center flex flex-col items-center">
//             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
//               <Package className="w-6 h-6" />
//             </div>
//             <h3 className="text-lg font-medium text-slate-900">No orders yet</h3>
//             <p className="mt-1 text-sm text-slate-500">Orders from customers paying via bank transfer will appear here.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Pagination } from "../components/Pagination";
import toast from "react-hot-toast";
import { OrderRow } from "../orderFeatures/OrderRow";
import { OrderDetailDrawer } from "../orderFeatures/OrderDetailDrawer";

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

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    if (!supabase) return;

    try {
      let query = supabase
        .from("orders")
        .select("*, customers(full_name, email)")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setOrders(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1); // Reset page on filter switch
  }, [statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Order status updated");
      fetchOrders();

      // Keep selected drawer sync updated if open
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev: any) => ({
          ...prev,
          status: newStatus,
          updated_at: new Date().toISOString(),
        }));
      }
    } catch (err: any) {
      toast.error(err.message || "Could not update status");
    }
  };

  const handleTrackingUpdate = async (id: string, code: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("orders")
        .update({ tracking_number: code, status: "shipped" })
        .eq("id", id);

      if (error) throw error;
      toast.success("Tracking code attached");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Could not save tracking asset");
    }
  };

  // --- PAGINATION PARAMETERS ---
  const totalOrders = orders.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col gap-6 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Order Management
          </h1>
          <p className="text-sm text-slate-500">
            Monitor fulfillment metrics, update logistics profiles, and track
            payments{" "}
            <span className="font-bold text-slate-700">
              {totalOrders ? `(${totalOrders} total)` : ""}
            </span>
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Financial Total</th>
                {/* <th className="px-6 py-4">Tracking Identifier</th> */}
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4 text-center">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading &&
                paginatedOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onSelect={() => setSelectedOrder(order)}
                    onStatusChange={handleStatusUpdate}
                    onTrackingChange={handleTrackingUpdate}
                  />
                ))}
            </tbody>
          </table>

          {loading && (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {totalOrders === 0 && !loading && (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm">
                No recorded structural purchases match this parameter query.
              </p>
            </div>
          )}
        </div>

        <Pagination
          totalItems={totalOrders}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* COMPREHENSIVE HISTORIC DRAWER */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
