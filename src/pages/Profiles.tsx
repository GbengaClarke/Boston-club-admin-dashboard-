// import React, { useState, useEffect } from "react";
// import { supabase } from "../lib/supabase";
// import { Users, Mail, Phone, Calendar } from "lucide-react";
// import { motion } from "motion/react";

// export function Profiles() {
//   const [profiles, setProfiles] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchProfiles = async () => {
//     setLoading(true);
//     if (!supabase) {
//       setLoading(false);
//       return;
//     }

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*, orders(count)")
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Error fetching profiles:", error);
//     }

//     if (data) setProfiles(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-slate-800">Profiles</h1>
//           <p className="text-sm text-slate-500">
//             View registered profiles and their profiles
//           </p>
//         </div>
//       </div>

//       <div className="glass-card overflow-hidden">
//         {loading ? (
//           <div className="p-12 flex justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : profiles.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm whitespace-nowrap">
//               <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
//                 <tr>
//                   <th className="px-6 py-4 font-medium">Customer Details</th>
//                   <th className="px-6 py-4 font-medium">Contact</th>
//                   <th className="px-6 py-4 font-medium text-center">
//                     Total Orders
//                   </th>
//                   <th className="px-6 py-4 font-medium text-right">Joined</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {profiles.map((customer) => (
//                   <motion.tr
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     key={customer.id}
//                     className="hover:bg-slate-50/50 transition-colors"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
//                           {customer.full_name
//                             ? customer.full_name.charAt(0).toUpperCase()
//                             : "U"}
//                         </div>
//                         <div className="flex flex-col">
//                           <span className="font-bold text-slate-900">
//                             {customer.full_name || "Unnamed User"}
//                           </span>
//                           <span
//                             className="text-xs text-slate-400 font-mono"
//                             title={customer.id}
//                           >
//                             {customer.id.slice(0, 8)}...
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col gap-1">
//                         <div className="flex items-center gap-2 text-slate-600 text-sm">
//                           <Mail className="w-3.5 h-3.5 text-slate-400" />
//                           {customer.email}
//                         </div>
//                         {customer.phone && (
//                           <div className="flex items-center gap-2 text-slate-600 text-sm">
//                             <Phone className="w-3.5 h-3.5 text-slate-400" />
//                             {customer.phone}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
//                         {customer.orders?.[0]?.count || 0}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex flex-col items-end gap-1 text-slate-500">
//                         <div className="flex items-center gap-1.5">
//                           <Calendar className="w-3.5 h-3.5" />
//                           <span>
//                             {new Date(customer.created_at).toLocaleDateString()}
//                           </span>
//                         </div>
//                         <span className="text-[10px] uppercase tracking-wider">
//                           {new Date(customer.created_at).toLocaleTimeString(
//                             [],
//                             { hour: "2-digit", minute: "2-digit" }
//                           )}
//                         </span>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-16 text-center flex flex-col items-center">
//             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
//               <Users className="w-8 h-8" />
//             </div>
//             <h3 className="text-lg font-bold text-slate-900 tracking-tight">
//               No profiles yet
//             </h3>
//             <p className="mt-1 text-sm text-slate-500 max-w-sm">
//               When users sign in and create profiles, they will appear here.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { Users, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { Pagination } from "../components/Pagination";
import { ProfileSortField, useProfiles } from "../profileFeatures/useProfiles";
import { ProfileRow } from "../profileFeatures/ProfileRow";

export function Profiles() {
  const {
    profiles,
    totalCount,
    isLoading,
    roleFilter,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    changeFilter,
    setCurrentPage,
    changeSort,
  } = useProfiles();

  const renderSortIndicator = (field: ProfileSortField) => {
    if (sortBy !== field) {
      return (
        <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300 opacity-60 inline-block" />
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1 text-indigo-500 inline-block" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-indigo-500 inline-block" />
    );
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      {/* ACTION BLOCK TOPHEADER OPTIONS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Profiles
          </h1>
          <p className="text-sm text-slate-500">
            View registered system profiles, assign access contexts, and manage
            parameters{" "}
            {totalCount ? (
              <span className="font-bold text-slate-700">
                ({totalCount} records)
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => changeFilter(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-lg text-xs bg-white py-2 px-3 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Profiles</option>
            <option value="customer">Customer Accounts</option>
            <option value="admin">Admin Privilege Users</option>
          </select>
        </div>
      </div>

      {/* CORE SYSTEM CONTAINER GRID CARD */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
              <tr>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                  onClick={() => changeSort("full_name")}
                >
                  Customer Details {renderSortIndicator("full_name")}
                </th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th
                  className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                  onClick={() => changeSort("orders_count")}
                >
                  Shipped Orders {renderSortIndicator("orders_count")}
                </th>
                <th
                  className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                  onClick={() => changeSort("created_at")}
                >
                  Joined {renderSortIndicator("created_at")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading &&
                profiles.map((customer) => (
                  <ProfileRow key={customer.id} customer={customer} />
                ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {totalCount === 0 && !isLoading && (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <Users className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm">
                No profiles found matching this criteria query.
              </p>
            </div>
          )}
        </div>

        {/* INTEGRATED REUSABLE FOOTER CONTROL BLOCK */}
        <Pagination
          totalItems={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}
