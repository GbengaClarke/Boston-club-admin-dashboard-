import { ShoppingBag, Truck, AlertTriangle } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { PiMoneyWavyBold } from "react-icons/pi";
interface StatCardsProps {
  revenue: number;
  aov: number;
  pending: number;
  cancellations: number;
}

export function StatCards({
  revenue,
  aov,
  pending,
  cancellations,
}: StatCardsProps) {
  const metrics = [
    {
      title: "Gross Revenue",
      value: formatCurrency(revenue, true),
      icon: PiMoneyWavyBold,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(aov, true),
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Fulfillment Queue",
      value: `${pending} pending`,
      icon: Truck,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Cancellation Rate",
      value: `${cancellations.toFixed(1)}% ratio`,
      icon: AlertTriangle,
      color: "bg-rose-50 text-rose-700 border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 min-[471px]:grid-cols-2 min-[1200px]:grid-cols-4 gap-4 sm:gap-5">
      {metrics.map((card, i) => (
        <div
          key={i}
          className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4"
        >
          <div
            className={`w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0 ${card.color}`}
          >
            <card.icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider break-words">
              {card.title}
            </p>

            <h3
              className="mt-1 text-[clamp(0.95rem,2vw,1.125rem)] font-bold text-slate-900 break-words leading-tight select-all"
              title={card.value}
            >
              {card.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
