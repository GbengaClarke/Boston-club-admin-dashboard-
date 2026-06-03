// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { Trash2, MessageSquare, Star } from 'lucide-react';
// import { motion } from 'motion/react';

// export function Reviews() {
//   const [reviews, setReviews] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchReviews = async () => {
//     setLoading(true);
//     if (!supabase) return;

//     const { data, error } = await supabase
//       .from('reviews')
//       .select(`
//         *,
//         product:products(name),
//         customer:customers(full_name, email)
//       `);

//     if (error) console.error(error);
//     if (data) setReviews(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   const deleteReview = async (id: string) => {
//     if (!supabase || !confirm('Are you sure you want to delete this review?')) return;
//     await supabase.from('reviews').delete().eq('id', id);
//     fetchReviews();
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-slate-800">Reviews</h1>
//           <p className="text-sm text-slate-500">Manage customer feedback</p>
//         </div>
//       </div>

//       <div className="glass-card overflow-hidden">
//         {loading ? (
//           <div className="p-12 flex justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//           </div>
//         ) : reviews.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
//                 <tr>
//                   <th className="px-6 py-4 font-medium">Customer</th>
//                   <th className="px-6 py-4 font-medium">Product</th>
//                   <th className="px-6 py-4 font-medium">Rating</th>
//                   <th className="px-6 py-4 font-medium w-1/2">Comment</th>
//                   <th className="px-6 py-4 font-medium text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {reviews.map((review) => (
//                   <motion.tr
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     key={review.id}
//                     className="hover:bg-slate-50/50 transition-colors"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col">
//                         <span className="font-bold text-slate-900">{review.customer?.full_name || 'Anonymous User'}</span>
//                         <span className="text-xs text-slate-500">{review.customer?.email || review.customer_id}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap">{review.product?.name || review.product_id}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center text-amber-400">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
//                         ))}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-slate-700 italic">"{review.comment}"</td>
//                     <td className="px-6 py-4 text-right whitespace-nowrap">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={() => deleteReview(review.id)}
//                           className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-12 text-center flex flex-col items-center">
//             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
//               <MessageSquare className="w-6 h-6" />
//             </div>
//             <h3 className="text-lg font-medium text-slate-900">No reviews yet</h3>
//             <p className="mt-1 text-sm text-slate-500">When customers review your products, they will appear here.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import {
  MessageSquare,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";
import { Pagination } from "../components/Pagination";
import { useReviews } from "../reviewsFeatures/useReviews";
import { ReviewRow } from "../reviewsFeatures/ReviewRow";
import { Modal } from "../ui/Modal";

const PAGE_SIZE = 10;
type SortField = "rating" | "created_at";
type SortDirection = "asc" | "desc";

export function Reviews() {
  const [displayFilter, setDisplayFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortDirection>("desc");

  // Destructure reactive mutation configurations
  const { allReviews, isLoading, toggleDisplay, deleteReview } =
    useReviews(displayFilter);

  // Stern confirmation state flags
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // --- 🧠 MEMOIZED DATA ARRAYS ---
  const processedReviews = useMemo(() => {
    const recordsCopy = [...allReviews];
    recordsCopy.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (sortBy === "rating") {
        return sortOrder === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      const dateA = valueA ? new Date(valueA).getTime() : 0;
      const dateB = valueB ? new Date(valueB).getTime() : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    return recordsCopy;
  }, [allReviews, sortBy, sortOrder]);

  const totalReviews = processedReviews.length;
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return processedReviews.slice(startIndex, startIndex + PAGE_SIZE);
  }, [processedReviews, currentPage]);

  // --- 🔀 ACTION HANDLERS ---
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleExecuteDelete = () => {
    if (deleteTargetId) {
      deleteReview(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field)
      return (
        <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300 opacity-60 inline" />
      );
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 ml-1 text-indigo-500 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-indigo-500 inline" />
    );
  };

  return (
    <div className="relative flex flex-col gap-6 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Review Management
          </h1>
          <p className="text-sm text-slate-500">
            Monitor client feedback profiles, check evaluation patterns, and
            verify layout displays{" "}
            <span className="font-bold text-slate-700">
              {totalReviews ? `(${totalReviews} matched)` : ""}
            </span>
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={displayFilter}
            onChange={(e) => {
              setDisplayFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-slate-200 rounded-lg text-xs bg-white py-2 px-3 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Shared Reviews</option>
            <option value="displayed">Publicly Displayed</option>
            <option value="hidden">Moderated / Hidden</option>
          </select>
        </div>
      </div>

      {/* TABLE ELEMENT VIEW CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Customer Details</th>
                <th className="px-6 py-4 font-bold">Product</th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  onClick={() => handleSort("rating")}
                >
                  Star Score {renderSortIndicator("rating")}
                </th>
                <th className="px-6 py-4 font-bold w-1/2 whitespace-normal">
                  Written Comment
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  Submission Date {renderSortIndicator("created_at")}
                </th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedReviews.map((review) => (
                <ReviewRow
                  key={review.id}
                  review={review}
                  disabled={isLoading}
                  onToggleDisplay={(id, currentStatus) =>
                    toggleDisplay({ id, is_displayed: currentStatus })
                  }
                  onInitiateDelete={(id) => setDeleteTargetId(id)}
                />
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {totalReviews === 0 && !isLoading && (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <MessageSquare className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm">
                No user feedback matched this parameter query.
              </p>
            </div>
          )}
        </div>

        {/* PAGINATION PANEL FOOTER */}
        <Pagination
          totalItems={totalReviews}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* STERN MUTATION CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Critical Action Required"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Are you absolutely sure?
            </h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This action is destructive and irreversible. Deleting this
              feedback profile will permanently alter item metrics and clean it
              from your system logs.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              onClick={() => setDeleteTargetId(null)}
              className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteDelete}
              className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm shadow-rose-100"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
