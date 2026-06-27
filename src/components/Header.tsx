import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "../adminFeatures/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userProfile, isLoading } = useCurrentUser();

  const handleSignOut = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white">
            Are you sure you want to sign out of your account?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await signOut();
                  queryClient.clear();
                  toast.success("Logged out successfully");
                } catch (error) {
                  toast.error("Error signing out");
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-sm"
            >
              Log Out
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
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #334155",
        },
      }
    );
  };

  const displayName = userProfile?.full_name || "Admin User";
  const displayRole = userProfile?.role || "Store Manager";
  const displayAvatar = userProfile?.image || "default-user.jpg";

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden brdx -ml-2 p-2 text-slate-500 cursor-pointer hover:text-slate-900"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-6">
          {/* System Status */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-pingx absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs  font-semibold text-emerald-700 uppercase tracking-wider">
              Store Live
            </span>
          </div>
        </div>

        <div className="h-8 w-px hidden sm:block bg-slate-200 mx-1"></div>

        <div className="hidden sm:block">
          <p className="text-xs text-slate-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 text-slate-500">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-3 rounded-full border border-transparent cursor-pointer transition-all focus:bg-slate-100"
          >
            <div className="w-8 h-8 rounded-full ring-1 ring-slate-200/80 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
              {isLoading ? (
                <div className="w-full h-full bg-slate-200 animate-pulse" />
              ) : (
                <img
                  src={displayAvatar}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="text-left hidden min-[480px]:block">
              {isLoading ? (
                <div className="flex flex-col gap-1 w-24">
                  <div className="h-3.5 bg-slate-200 rounded animate-pulse" />
                  <div className="h-2.5 bg-slate-100 rounded animate-pulse w-16" />
                </div>
              ) : (
                <>
                  <div className="text-sm font-medium text-slate-900 line-clamp-1 capitalize">
                    {displayName}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {displayRole}
                  </div>
                </>
              )}
            </div>
          </button>

          <button
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full cursor-pointer transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
