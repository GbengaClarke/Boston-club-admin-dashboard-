import { ORDER_STATUS_CONFIG, OrderStatus } from "../types/ProductTypes";

interface ChartProps {
  data?: { status: string; count: number }[];
  categories?: { name: string; value: number }[];
  materials?: { name: string; value: number }[];
}

// export function RevenueChart({ data = [] }: { data: ChartProps["data"] }) {
//   const maxVal = Math.max(...data.map((d) => d.count), 1);

//   return (
//     <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-sm lg:col-span-2">
//       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
//         Order Operational Flow
//       </h3>

//       <div className="overflow-x-auto pb-2">
//         <div className="flex items-end gap-3 h-56 min-w-max">
//           {data.map((bar) => (
//             <div
//               key={bar.status}
//               className="flex flex-col items-center justify-end h-full"
//               style={{ width: "72px" }}
//             >
//               <span className="text-xs font-semibold text-slate-700 mb-2">
//                 {bar.count}
//               </span>

//               <div
//                 className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-lg transition-all duration-500"
//                 style={{
//                   height: `${(bar.count / maxVal) * 140}px`,
//                   minHeight: "8px",
//                 }}
//               />

//               <span
//                 className="mt-2 text-[11px] text-center text-slate-500 leading-tight"
//                 title={bar.status}
//               >
//                 {bar.status}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// interface ChartProps {
//   data: { status: string; count: number }[];
// }

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
  // 1. Create a fast lookup map of existing counts from the dynamic API response
  const countsLookup = data.reduce((acc, curr) => {
    acc[curr.status] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  // 2. Generate a complete filled array containing all 7 statuses at all times
  const completeData = ALL_STATUSES.map((status) => ({
    status,
    count: countsLookup[status] || 0,
  }));

  // 3. Find the maximum value to scale the bars proportionally
  const maxVal = Math.max(...completeData.map((d) => d.count), 1);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-sm lg:col-span-2">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 ">
        Order Operational Flow
      </h3>

      <div className="overflow-x-auto  pb-2">
        <div className="flex justify-between gap-3 h-56 min-w-max">
          {completeData.map((bar) => {
            const config = ORDER_STATUS_CONFIG[bar.status as OrderStatus];
            const label = config?.label || bar.status;

            return (
              <div
                key={bar.status}
                className="flex flex-col items-center  justify-end h-full"
                style={{ width: "72px" }}
              >
                {/* Dynamic count: correctly displays 0 when there are no items */}
                <span className="text-xs font-semibold text-slate-700 mb-2">
                  {bar.count}
                </span>

                {/* Visual bar container with standard min-height protection */}
                <div
                  className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(bar.count / maxVal) * 140}px`,
                    minHeight: "8px", // Keeps a small placeholder bar visible even at 0 count
                    opacity: bar.count === 0 ? 0.3 : 1, // Dims 0-count bars slightly for better visual hierarchy
                  }}
                />

                <span
                  className="mt-2 text-[11px] text-center text-slate-500 leading-tight capitalize truncate w-full"
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
    <div key={name} className="space-y-1">
      <div className="flex justify-between text-xs font-medium capitalize">
        <span className="text-slate-600">{name}</span>
        <span className="text-slate-900 font-bold">{val} units</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${(val / Math.max(max, 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-6">
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Material Share
        </h3>
        {materials.map((m) =>
          renderRow(
            m.name,
            m.value,
            Math.max(...materials.map((x) => x.value)),
            "bg-slate-800"
          )
        )}
      </div>
    </div>
  );
}
