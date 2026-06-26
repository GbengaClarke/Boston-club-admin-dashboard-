import { Users, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Pagination } from "../components/Pagination";
import { ProfileSortField, useProfiles } from "../profileFeatures/useProfiles";
import { ProfileRow } from "../profileFeatures/ProfileRow";

export function Profiles() {
  const {
    profiles,
    totalCount,
    isLoading,
    roleFilter,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    changeFilter,
    setCurrentPage,
    changeSort,
  } = useProfiles();

  const renderSortIndicator = (field: ProfileSortField) => (
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
            Profiles
          </h1>
          <p className="text-sm text-slate-500">
            View registered system profiles.{" "}
            <span className="font-bold whitespace-nowrap text-slate-700">
              {totalCount ? `(${totalCount} matched)` : ""}
            </span>
          </p>
        </div>

        <select
          value={roleFilter}
          onChange={(e) => changeFilter(e.target.value)}
          className="border border-slate-300 rounded-lg text-sm bg-white py-2 px-3 font-semibold text-slate-700 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All Profiles</option>
          <option value="customer">Customer Accounts</option>
          <option value="admin">Admin Privilege Users</option>
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
                  onClick={() => changeSort("full_name")}
                >
                  <div className="flex items-center">
                    Customer Details {renderSortIndicator("full_name")}
                  </div>
                </th>

                <th className="px-6 py-4 font-extrabold">Role</th>
                <th className="px-6 py-4 font-extrabold">Contact</th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => changeSort("orders_count")}
                >
                  <div className="flex items-center justify-center">
                    Shipped Orders {renderSortIndicator("orders_count")}
                  </div>
                </th>

                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => changeSort("created_at")}
                >
                  <div className="flex items-center justify-end">
                    Joined {renderSortIndicator("created_at")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading &&
                profiles.map((customer) => (
                  <ProfileRow key={customer.id} customer={customer} />
                ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="py-20 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {totalCount === 0 && !isLoading && (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <Users className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm">
                No profiles matched this parameter query.
              </p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <Pagination
          totalItems={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}
