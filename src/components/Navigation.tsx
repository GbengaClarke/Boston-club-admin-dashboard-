// import {
//   LayoutDashboard,
//   ShoppingBag,
//   ShoppingCart,
//   LogOut,
//   MessageSquare,
//   Users,
//   FolderTree,
//   Upload,
//   Database, // Separator icon for distinction
//   Loader2,
// } from "lucide-react";
// import { IoPersonAddOutline } from "react-icons/io5";

// import { GiSlippers } from "react-icons/gi";
// import { cn } from "../lib/utils";
// import { useLocation, Link } from "react-router-dom";
// import { useAuth } from "../lib/auth";
// import { useState } from "react";
// import {
//   uploadBostonClubCatalog,
//   seedOrdersAndItems,
// } from "@/data/sample-data";

// export function Sidebar({ className }: { className?: string }) {
//   const location = useLocation();
//   const { signOut } = useAuth();
//   const active = location.pathname;
//   const [isUploadingProducts, setIsUploadingProducts] = useState(false);
//   const [isUploadingOrders, setIsUploadingOrders] = useState(false);

//   const navItems = [
//     { name: "Dashboard", path: "/", icon: LayoutDashboard },
//     { name: "Products", path: "/products", icon: ShoppingBag },
//     { name: "Orders", path: "/orders", icon: ShoppingCart },
//     { name: "Reviews", path: "/reviews", icon: MessageSquare },
//     { name: "Profiles", path: "/profiles", icon: Users },
//     { name: "Add Admin", path: "/addadmin", icon: IoPersonAddOutline },
//   ];

//   const handleCatalogReset = async () => {
//     if (!confirm("Wipe everything and regenerate 20 fresh products?")) return;

//     setIsUploadingProducts(true);
//     try {
//       await uploadBostonClubCatalog();
//       alert("Catalog initialized successfully!");
//     } catch (error: any) {
//       console.error(error);
//       alert(`Initialization failed: ${error.message}`);
//     } finally {
//       setIsUploadingProducts(false);
//     }
//   };

//   const handleOrdersReset = async () => {
//     if (
//       !confirm(
//         "Wipe database and seed 12 comprehensive orders with 30 combined order line items?"
//       )
//     )
//       return;

//     setIsUploadingOrders(true);
//     try {
//       await seedOrdersAndItems();
//       alert("Orders and structured line items loaded successfully!");
//     } catch (error: any) {
//       console.error(error);
//       alert(`Transactional data seeding issue: ${error.message}`);
//     } finally {
//       setIsUploadingOrders(false);
//     }
//   };

//   return (
//     <div
//       className={cn(
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

//       {/* --- Seeding Operations Group --- */}
//       <div className="px-4 pt-4 flex flex-col gap-1 border-b border-slate-800/60 pb-3">
//         <span className="text-[10px] uppercase tracking-wider text-slate-500 px-3 font-bold mb-1">
//           Database Seeding
//         </span>

//         <button
//           onClick={handleCatalogReset}
//           disabled={isUploadingProducts || isUploadingOrders}
//           className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors text-left disabled:opacity-50"
//         >
//           {isUploadingProducts ? (
//             <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
//           ) : (
//             <Upload className="w-4 h-4" />
//           )}
//           <span className="truncate">
//             {isUploadingProducts ? "Seeding..." : "Seed Clean Catalog"}
//           </span>
//         </button>

//         <button
//           onClick={handleOrdersReset}
//           disabled={isUploadingProducts || isUploadingOrders}
//           className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors text-left disabled:opacity-50"
//         >
//           {isUploadingOrders ? (
//             <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
//           ) : (
//             <Database className="w-4 h-4" />
//           )}
//           <span className="truncate">
//             {isUploadingOrders ? "Processing..." : "Seed Orders Engine"}
//           </span>
//         </button>
//       </div>

//       {/* --- Main Navigation Layout --- */}
//       <div className="px-4 py-4 flex-1 flex flex-col gap-1">
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
  Upload,
  Database,
  Loader2,
} from "lucide-react";
import { IoPersonAddOutline } from "react-icons/io5";
import { GiSlippers } from "react-icons/gi";
import { cn } from "../lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useState } from "react";
import {
  uploadBostonClubCatalog,
  seedOrdersAndItems,
} from "@/data/sample-data";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const active = location.pathname;
  const [isUploadingProducts, setIsUploadingProducts] = useState(false);
  const [isUploadingOrders, setIsUploadingOrders] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: ShoppingBag },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Reviews", path: "/reviews", icon: MessageSquare },
    { name: "Profiles", path: "/profiles", icon: Users },
    { name: "Add Admin", path: "/addadmin", icon: IoPersonAddOutline },
  ];

  const handleCatalogReset = async () => {
    if (!confirm("Wipe everything and regenerate 20 fresh products?")) return;

    setIsUploadingProducts(true);
    try {
      await uploadBostonClubCatalog();
      alert("Catalog initialized successfully!");
    } catch (error: any) {
      console.error(error);
      alert(`Initialization failed: ${error.message}`);
    } finally {
      setIsUploadingProducts(false);
    }
  };

  const handleOrdersReset = async () => {
    if (
      !confirm(
        "Wipe database and seed 12 comprehensive orders with 30 combined order line items?"
      )
    )
      return;

    setIsUploadingOrders(true);
    try {
      await seedOrdersAndItems();
      alert("Orders and structured line items loaded successfully!");
    } catch (error: any) {
      console.error(error);
      alert(`Transactional data seeding issue: ${error.message}`);
    } finally {
      setIsUploadingOrders(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col w-64 h-screen border-r border-slate-800 bg-slate-900 text-sm font-medium",
        className
      )}
    >
      {/* Fixed Header */}
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
            <GiSlippers />
          </div>
          Boston Club
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* --- Seeding Operations Group --- */}
        <div className="px-4 pb-4 flex flex-col gap-1 border-b border-slate-800/60">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 px-3 font-bold mb-1">
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

        {/* --- Main Navigation --- */}
        <div className="px-4 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
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
      </div>
    </div>
  );
}
