// import {
//   LayoutDashboard,
//   ShoppingBag,
//   ShoppingCart,
//   LogOut,
//   MessageSquare,
//   Users,
//   FolderTree,
// } from "lucide-react";

// import { GiSlippers } from "react-icons/gi";
// import { cn } from "../lib/utils";
// import { useLocation, Link } from "react-router-dom";
// import { useAuth } from "../lib/auth";

// export function Sidebar({ className }: { className?: string }) {
//   const location = useLocation();
//   const { signOut } = useAuth();
//   const active = location.pathname;

//   const navItems = [
//     { name: "Dashboard", path: "/", icon: LayoutDashboard },
//     { name: "Products", path: "/products", icon: ShoppingBag },
//     { name: "Categories", path: "/categories", icon: FolderTree },
//     { name: "Orders", path: "/orders", icon: ShoppingCart },
//     { name: "Reviews", path: "/reviews", icon: MessageSquare },
//     { name: "Customers", path: "/customers", icon: Users },
//   ];

//   return (
//     <div
//       className={cn(
//         // Remove h-screen here so it doesn't conflict with the layout wrapper
//         "flex flex-col w-64 border-r border-slate-800 bg-slate-900 text-sm font-medium",
//         className
//       )}
//     >
//       <div className="p-6 pb-2">
//         <div className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight">
//           <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
//             <GiSlippers />
//           </div>
//           Boston Club
//         </div>
//       </div>

//       <div className="px-4 py-6 flex-1 flex flex-col gap-1">
//         {navItems.map((item) => (
//           <Link
//             key={item.name}
//             to={item.path}
//             className={cn(
//               "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-slate-300 hover:bg-slate-800",
//               active === item.path &&
//                 "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300"
//             )}
//           >
//             <item.icon className="w-4 h-4" />
//             {item.name}
//           </Link>
//         ))}
//       </div>

//       <div className="px-4 py-6 border-t border-slate-800 flex flex-col gap-1">
//         <button
//           onClick={signOut}
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-rose-400 hover:bg-slate-800 mt-1"
//         >
//           <LogOut className="w-4 h-4" />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  LogOut,
  MessageSquare,
  Users,
  FolderTree,
  Upload, // Added Upload icon
  Loader2, // Added Loader icon
} from "lucide-react";

import { GiSlippers } from "react-icons/gi";
import { cn } from "../lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useState } from "react"; // Added for loading state
import uploadBostonClubCatalog from "@/data/sample-data";

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  const { signOut } = useAuth();
  const active = location.pathname;
  const [isUploading, setIsUploading] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: ShoppingBag },
    // { name: "Categories", path: "/categories", icon: FolderTree },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Reviews", path: "/reviews", icon: MessageSquare },
    { name: "Customers", path: "/customers", icon: Users },
  ];

  const handleBatchUpload = async () => {
    if (!confirm("Are you sure you want to upload 20 dummy products?")) return;

    setIsUploading(true);
    try {
      await uploadBostonClubCatalog();
      alert("Products uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col w-64 border-r border-slate-800 bg-slate-900 text-sm font-medium",
        className
      )}
    >
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
            <GiSlippers />
          </div>
          Boston Club
        </div>
      </div>

      {/* --- New Upload Button --- */}
      <button
        onClick={handleBatchUpload}
        disabled={isUploading}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-1",
          "text-slate-400 hover:text-emerald-400 hover:bg-slate-800 disabled:opacity-50"
        )}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {isUploading ? "Uploading..." : "Upload Seed Data"}
      </button>

      <div className="px-4 py-6 flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-slate-300 hover:bg-slate-800",
              active === item.path &&
                "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="px-4 py-6 border-t border-slate-800 flex flex-col gap-1">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-rose-400 hover:bg-slate-800 mt-1"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
