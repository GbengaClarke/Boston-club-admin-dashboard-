import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  ShieldCheck,
  MapPin,
  Layers,
  Trash2,
  AlertTriangle,
  Package,
} from "lucide-react";
import { cn, formatCurrency } from "../lib/utils";
import { ORDER_STATUS_CONFIG } from "../types/ProductTypes";
import { Modal } from "../ui/Modal";
import { useOrderDetails } from "./useOrderDetails";

interface OrderDetailDrawerProps {
  order: any;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export function OrderDetailDrawer({ order, onClose }: OrderDetailDrawerProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { items, isLoading, deleteOrder, isDeleting } = useOrderDetails(
    order?.id,
    order?.order_number,
    () => {
      setIsDeleteModalOpen(false);
      onClose();
    }
  );

  const currentStatusConfig = ORDER_STATUS_CONFIG[order?.status] || {
    className: "bg-slate-100 text-slate-700 border-slate-200",
    label: order?.status || "Pending",
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-950 tracking-tight">
                Order #{order?.order_number}
              </h2>
              <span
                className={cn(
                  "mt-2 inline-block text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase tracking-widest shadow-sm",
                  currentStatusConfig.className
                )}
              >
                {currentStatusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Customer Info */}
            <section>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Customer
                Data
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div>
                  <p className="font-bold text-slate-950 text-sm capitalize">
                    {order?.profiles?.full_name || "Guest"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {order?.profiles?.email || "No email provided"}
                  </p>
                </div>
                <div className="flex gap-2 text-slate-600 text-xs pt-4 border-t border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {order?.shipping_address || "No address provided"}
                  </p>
                </div>
              </div>
            </section>

            {/* Items */}
            <section className="w-full">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Order Items
              </h3>

              {isLoading ? (
                <div className="py-20 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-12 h-12 sm:w-10 sm:h-10 shrink-0 bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center">
                          {item.product_images?.image_url ? (
                            <img
                              src={item.product_images.image_url}
                              alt={item.products?.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 sm:w-4 sm:h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">
                            {item.products?.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold whitespace-nowrap">
                              Color:{" "}
                              <span className="text-indigo-600">
                                {item.product_images?.color_name || "N/A"}
                              </span>
                            </p>
                            <span className="text-slate-300 hidden sm:inline">
                              |
                            </span>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold whitespace-nowrap">
                              Mat:{" "}
                              <span className="text-indigo-600">
                                {item.products?.material || "N/A"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right w-full sm:w-auto pl-[3.75rem] sm:pl-0">
                        <p className="font-black text-slate-950 text-sm">
                          {formatCurrency
                            ? formatCurrency(item.unit_price)
                            : `₦${item.unit_price}`}
                        </p>
                        <p className="text-[12px] font-bold text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                Total Value
              </span>
              <span className="text-2xl font-black text-indigo-700 tracking-tight">
                {formatCurrency
                  ? formatCurrency(order?.total_price)
                  : `₦${order?.total_price}`}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Delete Order"
      >
        <div className="flex flex-col gap-5">
          {/*  Warning Box */}
          <div className="flex items-start gap-4 p-4 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-900">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <span className="font-black text-sm uppercase tracking-wider text-rose-950">
                Irreversible Action Warning
              </span>
              <p className="text-sm leading-relaxed text-rose-800">
                You are about to permanently delete{" "}
                <strong className="font-bold text-rose-950">
                  Order #BC-{order?.order_number}
                </strong>
                . This action wipes all the data of this order.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 font-medium px-1">
            This change cannot be undone. Are you absolutely certain you want to
            proceed?
          </p>

          {/* Buttons */}
          <div className="flex justify-end items-center gap-3 border-t border-slate-100 pt-5 mt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteOrder()}
              disabled={isDeleting}
              className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                "Yes, Delete Entire Order"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
