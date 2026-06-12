// src/features/admins/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "../lib/apiAdmin";

export function useCurrentUser() {
  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: getCurrentUserProfile,

  });

  return {
    userProfile,
    isLoading,
    error,
  };
}