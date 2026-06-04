import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfiles } from "../lib/apiProfiles";

export type ProfileSortField = "full_name" | "created_at" | "orders_count";
export type SortDirection = "asc" | "desc";
const PAGE_SIZE = 10;

export function useProfiles() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<ProfileSortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortDirection>("desc");

  // React Query data cache syncing
  const {
    data: rawProfiles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profiles", roleFilter],
    queryFn: () => getProfiles({ roleFilter }),
  });

  // Client-side sorting execution
  const sortedProfiles = useMemo(() => {
    const recordsCopy = [...rawProfiles];
    return recordsCopy.sort((a, b) => {
      let valueA: any = a[sortBy];
      let valueB: any = b[sortBy];

      // Handle custom embedded total count object mapping
      if (sortBy === "orders_count") {
        valueA = a.orders?.[0]?.count || 0;
        valueB = b.orders?.[0]?.count || 0;
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (sortBy === "created_at") {
        const timeA = valueA ? new Date(valueA).getTime() : 0;
        const timeB = valueB ? new Date(valueB).getTime() : 0;
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }

      // Default alphabetical sorting for strings (full_name)
      const strA = String(valueA || "").toLowerCase();
      const strB = String(valueB || "").toLowerCase();
      if (strA < strB) return sortOrder === "asc" ? -1 : 1;
      if (strA > strB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [rawProfiles, sortBy, sortOrder]);

  // Client-side array slice calculations for pagination tracking
  const totalProfilesCount = sortedProfiles.length;

  const paginatedProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedProfiles.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedProfiles, currentPage]);

  const changeSort = (field: ProfileSortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const changeFilter = (newRole: string) => {
    setRoleFilter(newRole);
    setCurrentPage(1);
  };

  return {
    profiles: paginatedProfiles,
    totalCount: totalProfilesCount,
    isLoading,
    error,
    roleFilter,
    currentPage,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
    changeFilter,
    setCurrentPage,
    changeSort,
  };
}
