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
        "border-b border-slate-200  transition-colors group",
        disabled && "opacity-40 pointer-events-none select-none"
      )}
    >
      {/* CUSTOMER */}
      <td className="px-6 py-4 vertical-align-top">
        <div className="flex flex-col">
          <span className="font-semibold capitalize text-slate-900 text-sm">
            {review.profile?.full_name || "Anonymous User"}
          </span>
          <span className="text-xs font-medium text-slate-500 mt-0.5">
            {review.profile?.email || review.customer_id}
          </span>
        </div>
      </td>

      {/* PRODUCT */}
      <td className="px-6 py-4 text-slate-900 font-medium text-sm whitespace-nowrap">
        {review.product_name || review.product?.name}
      </td>

      {/* RATING */}
      <td className="px-6 py-4">
        <div className="flex items-center text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4 stroke-[2.5]",
                i < review.rating ? "fill-current" : "text-slate-300"
              )}
            />
          ))}
        </div>
      </td>

      {/* COMMENT */}
      <td className="px-6 py-4 max-w-md min-w-[20rem]">
        <div
          className={cn(
            "rounded-xl transition-all duration-200",
            isExpanded && "bg-slate-50 border border-slate-200 p-4 shadow-inner"
          )}
        >
          <p
            className={cn(
              "text-slate-800 leading-relaxed break-words whitespace-normal text-sm",
              isExpanded ? "font-normal" : "font-normal text-slate-700"
            )}
          >
            "{displayedComment}"
          </p>

          {isLongComment && (
            <button
              type="button"
              onClick={onToggleExpand}
              className={cn(
                "mt-2.5 inline-flex items-center gap-1 text-xs font-bold transition-colors focus:outline-none focus:underline",
                isExpanded
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-indigo-600 hover:text-indigo-800"
              )}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  Collapse comment
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  Read full comment
                </>
              )}
            </button>
          )}
        </div>
      </td>

      {/* CREATED AT */}
      <td className="px-6 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
        {formattedDate}
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          {/* TOGGLE VISIBILITY */}
          <button
            type="button"
            onClick={() => onToggleDisplay(review.id, !review.is_displayed)}
            className={cn(
              "p-2 rounded-lg transition-all border",
              review.is_displayed
                ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800"
                : "text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
            )}
            title={
              review.is_displayed ? "Review is public" : "Review is hidden"
            }
          >
            {review.is_displayed ? (
              <Eye className="w-4 h-4 stroke-[2.25]" />
            ) : (
              <EyeOff className="w-4 h-4 stroke-[2.25]" />
            )}
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() => onInitiateDelete(review.id)}
            className="p-2 text-slate-600 bg-slate-50 border border-slate-200 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 rounded-lg transition-all"
            title="Delete review"
          >
            <Trash2 className="w-4 h-4 stroke-[2.25]" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
