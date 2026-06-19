import { useState } from "react";
import { toast } from "react-hot-toast";
import { Upload, Database, Loader2 } from "lucide-react";
import {
  uploadBostonClubCatalog,
  seedOrdersAndItems,
} from "@/data/sample-data";

export function SeedOperations() {
  const [isUploadingProducts, setIsUploadingProducts] = useState(false);
  const [isUploadingOrders, setIsUploadingOrders] = useState(false);

  const toastConfig = {
    duration: 6000,
    position: "top-center" as const,
    style: {
      minWidth: "320px",
      padding: "16px",
      background: "#1e293b",
      color: "#fff",
      border: "1px solid #334155",
    },
  };

  const handleCatalogReset = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white">
            Wipe everything and regenerate 20 fresh products?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setIsUploadingProducts(true);
                try {
                  await uploadBostonClubCatalog();
                  toast.success("Catalog initialized successfully!");
                } catch (error: any) {
                  toast.error(`Initialization failed: ${error.message}`);
                } finally {
                  setIsUploadingProducts(false);
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      ),
      toastConfig
    );
  };

  const handleOrdersReset = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white">
            Wipe database and seed 12 comprehensive orders with 30 combined
            items?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setIsUploadingOrders(true);
                try {
                  await seedOrdersAndItems();
                  toast.success("Orders loaded successfully!");
                } catch (error: any) {
                  toast.error(`Seeding issue: ${error.message}`);
                } finally {
                  setIsUploadingOrders(false);
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors shadow-sm"
            >
              Confirm Seed
            </button>
          </div>
        </div>
      ),
      toastConfig
    );
  };

  return (
    <div className="px-4 pb-4 flex flex-col gap-1 border-b border-slate-800/60">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 px-3 font-bold mb-1 select-none">
        Database Seeding
      </span>

      <button
        onClick={handleCatalogReset}
        disabled={isUploadingProducts || isUploadingOrders}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors text-left disabled:opacity-50"
      >
        {isUploadingProducts ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span className="truncate">
          {isUploadingProducts ? "Seeding..." : "Seed Clean Catalog"}
        </span>
      </button>

      <button
        onClick={handleOrdersReset}
        disabled={isUploadingProducts || isUploadingOrders}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors text-left disabled:opacity-50"
      >
        {isUploadingOrders ? (
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        ) : (
          <Database className="w-4 h-4" />
        )}
        <span className="truncate">
          {isUploadingOrders ? "Processing..." : "Seed Orders Engine"}
        </span>
      </button>
    </div>
  );
}
