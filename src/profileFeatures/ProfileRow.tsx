import { Mail, Phone, Calendar, Shield, User } from "lucide-react";
import { motion } from "motion/react";

interface CustomerProfile {
  id: string;
  full_name: string | null;
  image: string | null;
  role: "admin" | "customer";
  email: string;
  phone?: string | null;
  created_at: string;
  orders?: Array<{ count: number }>;
}

interface ProfileRowProps {
  customer: CustomerProfile;
}

export function ProfileRow({ customer }: ProfileRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" transition-colors group"
    >
      {/* CUSTOMER DETAILS */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* DYNAMIC AVATAR CONTAINER */}
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border border-indigo-100 shadow-sm">
            {customer.image ? (
              <img
                src={customer.image}
                alt={`${customer.full_name || "User"}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : customer.full_name ? (
              customer.full_name.charAt(0).toUpperCase()
            ) : (
              "U"
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-slate-900 capitalize tracking-tight">
              {customer.full_name || "Unnamed User"}
            </span>
            {/* <span className="text-xs text-slate-500 font-mono tracking-tighter">
              ID: {customer.id.slice(0, 8)}...
            </span> */}
          </div>
        </div>
      </td>

      {/* SYSTEM ACCESS ROLE PROFILE */}
      <td className="px-6 py-4">
        {customer.role === "admin" ? (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/70 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-900 border border-slate-200/60">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Customer
          </span>
        )}
      </td>

      {/* CONTACT INFORMATION */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
            <a
              href={`mailto:${customer.email}`}
              className="hover:text-indigo-600 hover:underline transition-colors"
            >
              {customer.email}
            </a>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>
      </td>

      {/* TOTAL ORDER METRIC COUNTER */}
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full bg-slate-100 text-slate-900 font-extrabold text-sm border border-slate-200/40">
          {customer.orders?.[0]?.count || 0}
        </span>
      </td>

      {/* TIME ACCOUNT WAS CREATED */}
      <td className="px-6 py-4 text-right">
        <div className="flex flex-col items-end gap-1 text-slate-700 font-medium">
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date(customer.created_at).toLocaleDateString("en-GB")}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {new Date(customer.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </td>
    </motion.tr>
  );
}
