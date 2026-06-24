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
type SortField = "rating" | "created_at" | "customer_name" | "product_name";
type SortDirection = "asc" | "desc";

export function Reviews() {
  const [displayFilter, setDisplayFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortDirection>("desc");

  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const { allReviews, isLoading, toggleDisplay, deleteReview } =
    useReviews(displayFilter);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const processedReviews = useMemo(() => {
    const recordsCopy = [...allReviews];
    recordsCopy.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (sortBy === "customer_name") {
        valueA = (a as any).profiles?.full_name;
        valueB = (b as any).profiles?.full_name;
      } else if (sortBy === "product_name") {
        valueA = (a as any).products?.name;
        valueB = (b as any).products?.name;
      }

      // Numeric Sort for Ratings
      if (sortBy === "rating") {
        return sortOrder === "asc"
          ? Number(valueA || 0) - Number(valueB || 0)
          : Number(valueB || 0) - Number(valueA || 0);
      }

      // Alphabetical / Date Sort
      const strA = String(valueA ?? "").toLowerCase();
      const strB = String(valueB ?? "").toLowerCase();

      return sortOrder === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
    return recordsCopy;
  }, [allReviews, sortBy, sortOrder]);

  const totalReviews = processedReviews.length;

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return processedReviews.slice(startIndex, startIndex + PAGE_SIZE);
  }, [processedReviews, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
    setExpandedReviewId(null);
  };

  const handleFilterChange = (val: string) => {
    setDisplayFilter(val);
    setCurrentPage(1);
    setExpandedReviewId(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setExpandedReviewId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleExpand = (id: string) => {
    setExpandedReviewId((prevId) => (prevId === id ? null : id));
  };

  const handleExecuteDelete = () => {
    if (deleteTargetId) {
      deleteReview(deleteTargetId);
      if (expandedReviewId === deleteTargetId) {
        setExpandedReviewId(null);
      }
      setDeleteTargetId(null);
    }
  };

  const renderSortIndicator = (field: SortField) => (
    <span className="inline-flex items-center ml-1 shrink-0">
      {sortBy !== field ? (
        <ArrowUpDown className="w-3 h-3 text-slate-400" />
      ) : sortOrder === "asc" ? (
        <ArrowUp className="w-3 h-3 text-indigo-600" />
      ) : (
        <ArrowDown className="w-3 h-3 text-indigo-600" />
      )}
    </span>
  );

  return (
    <div className="relative flex flex-col gap-6 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-5 justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Review Management
          </h1>
          <p className="text-sm text-slate-500">
            Monitor client feedback profiles and verify layout displays.{" "}
            <span className="font-bold whitespace-nowrap text-slate-700">
              {totalReviews ? `(${totalReviews} matched)` : ""}
            </span>
          </p>
        </div>

        <select
          value={displayFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border border-slate-300 rounded-lg text-sm bg-white py-2 px-3 font-semibold text-slate-700 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All Reviews</option>
          <option value="displayed">Publicly Displayed</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* TABLE ELEMENT VIEW CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-900 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("customer_name")}
                >
                  <div className="flex items-center">
                    Customer Details {renderSortIndicator("customer_name")}
                  </div>
                </th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("product_name")}
                >
                  <div className="flex items-center">
                    Product {renderSortIndicator("product_name")}
                  </div>
                </th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center">
                    Star Score {renderSortIndicator("rating")}
                  </div>
                </th>
                <th className="px-6 py-4 font-extrabold w-1/2 whitespace-normal">
                  Written Comment
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Submission Date {renderSortIndicator("created_at")}
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-extrabold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading &&
                paginatedReviews.map((review) => (
                  <ReviewRow
                    key={review.id}
                    review={review}
                    disabled={isLoading}
                    isExpanded={expandedReviewId === review.id}
                    onToggleExpand={() => handleToggleExpand(review.id)}
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

        {/* PAGINATION */}
        <Pagination
          totalItems={totalReviews}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Review"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-4 p-4 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-900">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5 text-left">
              <span className="font-black text-sm uppercase tracking-wider text-rose-950">
                Irreversible Action Warning
              </span>
              <p className="text-sm leading-relaxed text-rose-800">
                You are about to permanently delete this feedback profile. This
                action is completely destructive and will instantly wipe metrics
                and data histories directly out of active logging tables.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 font-medium text-left px-1">
            This operational system change cannot be rolled back. Are you
            absolutely certain you want to proceed?
          </p>

          <div className="flex justify-end items-center gap-3 border-t border-slate-100 pt-5 mt-2">
            <button
              type="button"
              onClick={() => setDeleteTargetId(null)}
              className="px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteDelete}
              className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-all shadow-sm"
            >
              Yes, Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
