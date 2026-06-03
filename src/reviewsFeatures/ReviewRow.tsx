import { motion } from "framer-motion";
import {
  Star,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "../lib/utils";

interface ReviewRowProps {
  review: any;
  disabled: boolean;
  isExpanded: boolean; // Driven dynamically by lifted parent accordion logic
  onToggleExpand: () => void; // Command up to central table mapping state
  onToggleDisplay: (id: string, currentStatus: boolean) => void;
  onInitiateDelete: (id: string) => void;
}

export function ReviewRow({
  review,
  disabled,
  isExpanded,
  onToggleExpand,
  onToggleDisplay,
  onInitiateDelete,
}: ReviewRowProps) {
  const commentText = review.comment || "";
  const isLongComment = commentText.length > 60;

  // Render the whole text body if it passes the matching state evaluation
  const displayedComment =
    isExpanded || !isLongComment
      ? commentText
      : `${commentText.substring(0, 60)}...`;

  const formattedDate = new Date(review.created_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "border-b border-slate-100 hover:bg-slate-50/5 transition-colors group",
        disabled && "opacity-40 pointer-events-none select-none"
      )}
    >
      {/* CUSTOMER */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">
            {review.customer?.full_name || "Anonymous User"}
          </span>
          <span className="text-[11px] font-mono text-slate-400 mt-0.5">
            {review.customer?.email || review.customer_id}
          </span>
        </div>
      </td>

      {/* PRODUCT */}
      <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap">
        {review.product_name || review.product?.name}
      </td>

      {/* RATING */}
      <td className="px-6 py-4">
        <div className="flex items-center text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < review.rating ? "fill-current" : "text-slate-200"
              )}
            />
          ))}
        </div>
      </td>

      {/* COMMENT */}
      <td className="px-2  py-4 max-w-mdx min-w-80">
        <div
          // layout
          // transition={{ duration: 0.25 }}
          className={cn(
            "rounded-xl transition-all duration-300",
            isExpanded &&
              "bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-4 shadow-sm"
          )}
        >
          <p
            className={cn(
              "text-slate-700 leading-relaxed break-words whitespace-normal",
              isExpanded ? "text-sm font-normal" : "text-sm italic"
            )}
          >
            "{displayedComment}"
          </p>

          {isLongComment && (
            <button
              type="button"
              onClick={onToggleExpand}
              className={cn(
                "mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-colors",
                isExpanded
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-indigo-600 hover:text-indigo-800"
              )}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Collapse comment
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Read full comment
                </>
              )}
            </button>
          )}
        </div>
      </td>

      {/* CREATED AT */}
      <td className="px-6 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">
        {formattedDate}
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          {/* TOGGLE VISIBILITY */}
          <button
            type="button"
            onClick={() => onToggleDisplay(review.id, !review.is_displayed)}
            className={cn(
              "p-1.5 rounded-md transition-all",
              review.is_displayed
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-slate-400 hover:bg-slate-100"
            )}
            title={
              review.is_displayed ? "Review is public" : "Review is hidden"
            }
          >
            {review.is_displayed ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() => onInitiateDelete(review.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
