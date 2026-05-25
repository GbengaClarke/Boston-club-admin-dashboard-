import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  badge?: string;
  children: ReactNode;
}

export default function ModalForm({
  isOpen,
  onClose,
  title,
  badge,
  children,
}: ModalFormProps) {
  // Prevent background viewport scroll tracking when the modal context is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  backdrop-blur-sm animate-fade-in">
      {/* Backdrop Click Dismissal Layer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Structural Dialog Canvas */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col my-4 max-h-[85vh] md:max-h-[88vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* STRUCTURAL HEADER WRAPPER */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5 shrink-0 bg-white">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {badge && (
              <span className="text-[10px] uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md font-bold">
                {badge}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg  text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* INJECTED FORM CONTENT BODY TRACK */}
        <div className="flex-1 overflow-y-auto p-5 pt-2 scrollbar-thin scrollbar-thumb-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
