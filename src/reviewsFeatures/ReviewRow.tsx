import { useState } from "react";
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
  onToggleDisplay: (id: string, currentStatus: boolean) => void;
  onInitiateDelete: (id: string) => void;
}

export function ReviewRow({
  review,
  disabled,
  onToggleDisplay,
  onInitiateDelete,
}: ReviewRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const commentText = review.comment || "";
  const isLongComment = commentText.length > 60;
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
        "border-b border-slate-100 hover:bg-slate-50/50 transition-colors group",
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
        {review.product?.name || review.product_id}
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

      {/* COLLAPSIBLE / EXPANDABLE COMMENT */}
      <td className="px-6 py-4 text-slate-600 font-normal whitespace-normal max-w-md">
        <div className="flex flex-col items-start gap-1">
          <p className="italic text-slate-700">"{displayedComment}"</p>
          {isLongComment && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-0.5 mt-1"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Read full comment <ChevronDown className="w-3 h-3" />
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
          {/* Toggle Visibility Switch Button */}
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

          {/* Delete Action Trigger */}
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
