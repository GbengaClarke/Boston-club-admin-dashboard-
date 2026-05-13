import { Bell, Menu, Search, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";
import { toast } from "react-hot-toast";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    // 1. Trigger a custom toast with "Confirm" and "Cancel" buttons
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-900">
            Are you sure you want to log out?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id); // Dismiss confirmation toast
                try {
                  await signOut();
                  toast.success("Logged out successfully");
                } catch (error) {
                  toast.error("Error signing out");
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          minWidth: "300px",
          padding: "16px",
          border: "1px solid #e2e8f0",
        },
      }
    );
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 text-slate-500">
        <button className="p-2 hover:bg-slate-50 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=admin" alt="User" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-medium text-slate-900 line-clamp-1">
                Admin User
              </div>
              <div className="text-xs text-slate-500">Store Manager</div>
            </div>
          </button>

          <button
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
