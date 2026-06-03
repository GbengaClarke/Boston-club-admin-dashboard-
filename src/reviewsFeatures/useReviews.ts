import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import {
  deleteReviewApi,
  fetchReviewsApi,
  updateReviewDisplayApi,
} from "../lib/apiReviews";

export function useReviews(displayFilter: string) {
  const queryClient = useQueryClient();
  const cacheKey = ["reviews", { displayFilter }];

  const reviewsQuery = useQuery({
    queryKey: cacheKey,
    queryFn: () => fetchReviewsApi({ displayFilter }),
    placeholderData: (previousData) => previousData,
  });

  const toggleDisplayMutation = useMutation({
    mutationFn: updateReviewDisplayApi,
    onMutate: async ({ id, is_displayed }) => {
      await queryClient.cancelQueries({ queryKey: cacheKey });
      const previousData = queryClient.getQueryData(cacheKey);

      queryClient.setQueryData(cacheKey, (old: any) => {
        if (!old) return old;
        return old.map((review: any) =>
          review.id === id ? { ...review, is_displayed } : review
        );
      });

      return { previousData };
    },
    onError: (err: any, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(cacheKey, context.previousData);
      }
      toast.error(err.message || "Failed to alter visibility state.");
    },
    onSuccess: () => {
      toast.success("Review visibility updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReviewApi,
    onSuccess: () => {
      toast.success("Review permanently deleted");
      queryClient.invalidateQueries({ queryKey: cacheKey });
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not delete this record.");
    },
  });

  return {
    allReviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    error: reviewsQuery.error,
    toggleDisplay: toggleDisplayMutation.mutate,
    deleteReview: deleteMutation.mutate,
  };
}
