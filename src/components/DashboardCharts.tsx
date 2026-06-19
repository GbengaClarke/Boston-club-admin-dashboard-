import { ORDER_STATUS_CONFIG, OrderStatus } from "../types/ProductTypes";

interface ChartProps {
  data?: { status: string; count: number }[];
  categories?: { name: string; value: number }[];
  materials?: { name: string; value: number }[];
}

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export function RevenueChart({ data = [] }: { data: ChartProps["data"] }) {
  const countsLookup = data.reduce((acc, curr) => {
    acc[curr.status] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  const completeData = ALL_STATUSES.map((status) => ({
    status,
    count: countsLookup[status] || 0,
  }));

  const maxVal = Math.max(...completeData.map((d) => d.count), 1);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
        Order Operational Flow
      </h3>

      <div className="overflow-x-auto pb-2">
        <div className="flex justify-between gap-3 h-56 min-w-max">
          {completeData.map((bar) => {
            const config = ORDER_STATUS_CONFIG[bar.status as OrderStatus];
            const label = config?.label || bar.status;

            return (
              <div
                key={bar.status}
                className="flex flex-col items-center justify-end h-full"
                style={{ width: "72px" }}
              >
                <span className="text-xs font-bold text-slate-900 mb-2">
                  {bar.count}
                </span>

                {/* VISUAL BAR */}

                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    bar.count === 0
                      ? "bg-indigo-300"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  style={{
                    height: `${(bar.count / maxVal) * 140}px`,
                    minHeight: "8px",
                  }}
                />

                <span
                  className="mt-2 text-[11px] font-bold text-center text-slate-700 leading-tight capitalize truncate w-full"
                  title={label}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CategoryChart({
  categories = [],
  materials = [],
}: {
  categories: ChartProps["categories"];
  materials: ChartProps["materials"];
}) {
  const renderRow = (name: string, val: number, max: number, color: string) => (
    <div key={name} className="space-y-1.5">
      <div className="flex justify-between text-xs capitalize">
        <span className="text-slate-800 font-semibold">{name}</span>
        <span className="text-slate-900 font-extrabold">{val} units</span>
      </div>
      <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${(val / Math.max(max, 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between gap-6">
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Category Performance
        </h3>
        {categories.map((c) =>
          renderRow(
            c.name,
            c.value,
            Math.max(...categories.map((x) => x.value)),
            "bg-indigo-600"
          )
        )}
      </div>
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Material Share
        </h3>
        {materials.map((m) =>
          renderRow(
            m.name,
            m.value,
            Math.max(...materials.map((x) => x.value)),
            "bg-slate-500"
          )
        )}
      </div>
    </div>
  );
}
