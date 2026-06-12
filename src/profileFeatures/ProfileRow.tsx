import { Mail, Phone, Calendar, Shield, User } from "lucide-react";
import { motion } from "motion/react";

interface ProfileRowProps {
  customer: any;
}

export function ProfileRow({ customer }: ProfileRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-slate-50/1 transition-colors group"
    >
      {/* CUSTOMER DETAILS */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* DYNAMIC AVATAR CONTAINER */}
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0 ">
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
            <span className="font-bold text-slate-900">
              {customer.full_name || "Unnamed User"}
            </span>
          </div>
        </div>
      </td>

      {/* SYSTEM ACCESS ROLE PROFILE */}
      <td className="px-6 py-4">
        {customer.role === "admin" ? (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Shield className="w-3 h-3" /> Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <User className="w-3 h-3" /> Customer
          </span>
        )}
      </td>

      {/* CONTACT INFORMATION */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            {customer.email}
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {customer.phone}
            </div>
          )}
        </div>
      </td>

      {/* TOTAL ORDER METRIC COUNTER */}
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
          {customer.orders?.[0]?.count || 0}
        </span>
      </td>

      {/* TIME ACCOUNT WAS CREATED */}
      <td className="px-6 py-4 text-right">
        <div className="flex flex-col items-end gap-1 text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(customer.created_at).toLocaleDateString()}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider">
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
