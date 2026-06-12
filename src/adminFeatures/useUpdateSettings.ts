// src/adminFeatures/useUpdateSettings.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateCurrentUserProfile } from "../lib/apiUser";


export function useUpdateSettings() {
  const queryClient = useQueryClient();

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: updateCurrentUserProfile,
    onSuccess: () => {
      toast.success("Profile updates saved successfully!");
      // Tells React Query to invalidate and re-fetch the user profile data everywhere instantly
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to preserve security parameters.");
    },
  });

  return { updateSettings, isUpdating };
}