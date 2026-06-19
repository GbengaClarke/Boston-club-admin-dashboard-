import { Link } from "react-router-dom";
import { Settings as SettingsIcon } from "lucide-react";
import { GiSlippers } from "react-icons/gi";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm py-5 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        {/* LEFT SECTION: BRANDING & OPERATIONAL STATUS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <div className="rounded-lg bg-indigo-500x flex items-center justify-center text-indigo-500 text-[1rem] font-bold">
              <GiSlippers />
            </div>
            <span>Boston Club HQ</span>
          </div>
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
