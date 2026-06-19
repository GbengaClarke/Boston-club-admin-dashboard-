import { toast } from "react-hot-toast";

export function ToastPlayground() {
  const triggerToast = (type: "dark" | "light" | "accent") => {
    const styles = {
      dark: {
        background: "#1e293b",
        color: "#ffffff",
        border: "1px solid #334155",
      },
      light: {
        background: "#ffffff",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
      accent: {
        background: "#eef2ff", // Indigo 50
        color: "#3730a3", // Indigo 800
        border: "1px solid #c7d2fe", // Indigo 200
      },
    };

    toast("This is a test notification!", {
      style: styles[type],
    });
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 shadow-sm my-8">
      <h3 className="font-semibold text-slate-900">Toast Style Tester</h3>
      <p className="text-sm text-slate-500">
        Click to see which style fits your dashboard best:
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => triggerToast("dark")}
          className="px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 transition-all"
        >
          Dark
        </button>
        <button
          onClick={() => triggerToast("light")}
          className="px-3 py-2 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded hover:bg-slate-50 transition-all"
        >
          Light
        </button>
        <button
          onClick={() => triggerToast("accent")}
          className="px-3 py-2 bg-indigo-100 text-indigo-800 text-xs font-bold rounded hover:bg-indigo-200 transition-all"
        >
          Accent
        </button>
      </div>
    </div>
  );
}
