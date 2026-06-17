import React from "react";
import { Link } from "react-router-dom";
import { Shield, Settings as SettingsIcon } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/50 backdrop-blur-sm py-5 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        {/* LEFT SECTION: BRANDING & OPERATIONAL STATUS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Boston Club HQ</span>
          </div>
          {/* <span className="hidden sm:inline text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>System Active</span>
          </div> */}
        </div>

        {/* MIDDLE SECTION: COPYRIGHT */}
        <div className="text-center md:text-left font-medium">
          &copy; {currentYear} Boston Club Nigeria. All rights reserved.
        </div>

        {/* RIGHT SECTION: ADMIN NAV LINKS */}
        <div className="flex items-center gap-5 font-semibold">
          <Link
            to="/settings"
            className="flex items-center gap-1 hover:text-slate-800 transition-colors"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
