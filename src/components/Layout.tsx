// import { Outlet } from "react-router-dom";
// import { Sidebar } from "./Navigation";
// import { useState } from "react";
// import { cn } from "../lib/utils";
// import { Header } from "./Header";

// export function Layout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
//       {/* 1. Mobile Overlay: Only visible when sidebar is open on small screens */}
//       <div
//         className={cn(
//           "fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity duration-300",
//           sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         )}
//         onClick={() => setSidebarOpen(false)}
//       />

//       {/* 2. Sidebar Wrapper */}
//       <aside
//         className={cn(
//           // 1. Base styles and mobile behavior
//           "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-300 ease-in-out",

//           // 2. Mobile Logic (This handles the state)
//           // sidebarOpen ? "translate-x-0" : "-translate-x-full ",

//           // 3. Desktop Overrides (Place these LAST so they win on md screens)
//           "md:static md:translate-x-0"
//         )}
//       >
//         <Sidebar className="h-full" />
//       </aside>

//       {/* 3. Main Content Area */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         {/* Pass the toggle function to Header */}
//         <Header onMenuClick={() => setSidebarOpen(true)} />

//         <div className="flex-1 overflow-y-auto">
//           <main className="p-6 lg:p-8 max-w-7xl mx-auto">
//             {/* This is where your page content (Dashboard, Properties, etc.) renders */}
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Navigation";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Header } from "./Header";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      {/* Mobile Sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/50 z-20 md:hidden transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:static inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <Sidebar className="h-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <main className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
