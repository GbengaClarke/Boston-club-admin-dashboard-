import { useState } from "react";
import { toast } from "react-hot-toast";
import { Database, Loader2 } from "lucide-react";
import { seedCompleteStoreDataset } from "@/data/sample-data";

export function SeedOperations() {
  const [isSeeding, setIsSeeding] = useState(false);

  const toastConfig = {
    duration: 6000,
    position: "top-center" as const,
    style: {
      minWidth: "340px",
      padding: "16px",
      background: "#1e293b",
      color: "#fff",
      border: "1px solid #334155",
    },
  };

  const handleStoreSeed = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white">
            Wipe database and generate 12 premium footwear products and 30
            analytical orders spread over 90 days?
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
                setIsSeeding(true);
                try {
                  await seedCompleteStoreDataset();
                  toast.success("Store environment initialized successfully!");
                } catch (error: any) {
                  toast.error(`Seeding failed: ${error.message}`);
                } finally {
                  setIsSeeding(false);
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm"
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
        onClick={handleStoreSeed}
        disabled={isSeeding}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors text-left disabled:opacity-50"
      >
        {isSeeding ? (
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
        ) : (
          <Database className="w-4 h-4" />
        )}
        <span className="truncate">
          {isSeeding ? "Seeding Store Engine..." : "Seed Complete Dataset"}
        </span>
      </button>
    </div>
  );
}
