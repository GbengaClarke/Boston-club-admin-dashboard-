import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="px-6 py-4 gap-2 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">{startIndex + 1}</span> to{" "}
        <span className="font-medium text-slate-700">
          {Math.min(startIndex + pageSize, totalItems)}
        </span>{" "}
        of <span className="font-medium text-slate-700">{totalItems}</span>{" "}
        records
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
