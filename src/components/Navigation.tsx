// import {
//   LayoutDashboard,
//   ShoppingBag,
//   ShoppingCart,
//   MessageSquare,
//   Users,
// } from "lucide-react";
// import { IoPersonAddOutline } from "react-icons/io5";
// import { GiSlippers } from "react-icons/gi";
// import { cn } from "../lib/utils";
// import { useLocation, Link } from "react-router-dom";
// import { SeedOperations } from "./SeedOperations";

// interface SidebarProps {
//   className?: string;
//   onClose?: () => void;
// }

// export function Sidebar({ className, onClose }: SidebarProps) {
//   const location = useLocation();
//   const active = location.pathname;

//   const navItems = [
//     { name: "Dashboard", path: "/", icon: LayoutDashboard },
//     { name: "Products", path: "/products", icon: ShoppingBag },
//     { name: "Orders", path: "/orders", icon: ShoppingCart },
//     { name: "Reviews", path: "/reviews", icon: MessageSquare },
//     { name: "Profiles", path: "/profiles", icon: Users },
//     { name: "Add Admin", path: "/addadmin", icon: IoPersonAddOutline },
//   ];

//   return (
//     <div
//       className={cn(
//         "flex flex-col w-64 md:w-max lg:w-64 h-screen border-r border-slate-800 bg-slate-900 text-sm font-medium",
//         className
//       )}
//     >
//       <div className="p-6 shrink-0">
//         <div className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight">
//           <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
//             <GiSlippers />
//           </div>
//           Boston Club
//         </div>
//       </div>

//       {/* Scrollable Content Area */}
//       <div className="flex-1  overflow-y-auto custom-scrollbar">
//         <SeedOperations />

//         <div className="px-4 py-4  flex flex-col gap-1">
//           {navItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.path}
//               onClick={onClose}
//               className={cn(
//                 "flex  items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-slate-300 hover:bg-slate-800",
//                 active === item.path &&
//                   "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300"
//               )}
//             >
//               <item.icon className="w-4 h-4" />
//               {item.name}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  MessageSquare,
  Users,
} from "lucide-react";
import { IoPersonAddOutline } from "react-icons/io5";
import { GiSlippers } from "react-icons/gi";
import { cn } from "../lib/utils";
import { useLocation, Link } from "react-router-dom";
import { SeedOperations } from "./SeedOperations";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const location = useLocation();
  const active = location.pathname;

  const [showSeedOps, setShowSeedOps] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: ShoppingBag },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Reviews", path: "/reviews", icon: MessageSquare },
    { name: "Profiles", path: "/profiles", icon: Users },
    { name: "Add Admin", path: "/addadmin", icon: IoPersonAddOutline },
  ];

  return (
    <div
      className={cn(
        "flex flex-col w-64 md:w-max lg:w-64 h-screen border-r border-slate-800 bg-slate-900 text-sm font-medium select-none",
        className
      )}
    >
      <div className="p-6 shrink-0">
        <div className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
            <GiSlippers />
          </div>
          Boston Club
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Conditional UI Block — Renders purely based on local component state */}
        {showSeedOps && <SeedOperations />}

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

        <div
          className="opacity-0 bg-red-300 w-max fixed bottom-0"
          onClick={() => setShowSeedOps((prev) => !prev)}
        >
          hi
        </div>
      </div>
    </div>
  );
}
