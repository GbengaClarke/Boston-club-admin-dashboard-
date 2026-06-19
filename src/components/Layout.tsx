import { Outlet } from "react-router-dom";
import { Sidebar } from "./Navigation";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen max-w-7xl mx-auto bg-slate-100 overflow-hidden text-slate-900 font-sans">
      {/* Mobile Sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/50 z-20 md:hidden transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* bigger screen Sidebar */}
      <div className="hidden md:block">
        <Sidebar className="h-full" onClose={() => setSidebarOpen(false)} />
      </div>

      {/* smaller screen Sidebar */}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 md:hidden transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar className="h-full" onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <main className="py-6 px-4 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
