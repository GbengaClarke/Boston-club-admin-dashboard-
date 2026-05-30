import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrdersApi,
  updateOrderStatusApi,
  updateOrderTrackingApi,
} from "../lib/apiOrders";
import toast from "react-hot-toast";

export function useOrders(statusFilter: string) {
  const queryClient = useQueryClient();
  const cacheQueryKey = ["orders", { statusFilter }];

  // 1. Fetching Query
  const ordersQuery = useQuery({
    queryKey: cacheQueryKey,
    queryFn: () => fetchOrdersApi({ statusFilter }),
    placeholderData: (previousData) => previousData,
  });

  // 2. Status Mutation
  const statusMutation = useMutation({
    mutationFn: updateOrderStatusApi,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: cacheQueryKey });
      const previousOrdersData = queryClient.getQueryData(cacheQueryKey);

      queryClient.setQueryData(cacheQueryKey, (old: any) => {
        if (!old) return old;
        return old.map((order: any) =>
          order.id === id ? { ...order, status } : order
        );
      });
      return { previousOrdersData };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousOrdersData) {
        queryClient.setQueryData(cacheQueryKey, context.previousOrdersData);
      }
      toast.error(err.message || "Failed to update status on server.");
    },
    onSuccess: () => toast.success("Order status synchronized"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: cacheQueryKey }),
  });

  // 3. Tracking Mutation
  const trackingMutation = useMutation({
    mutationFn: updateOrderTrackingApi,
    onMutate: async ({ id, code }) => {
      await queryClient.cancelQueries({ queryKey: cacheQueryKey });
      const previousOrdersData = queryClient.getQueryData(cacheQueryKey);

      queryClient.setQueryData(cacheQueryKey, (old: any) => {
        if (!old) return old;
        return old.map((order: any) =>
          order.id === id
            ? { ...order, tracking_number: code, status: "shipped" }
            : order
        );
      });
      return { previousOrdersData };
    },
    onError: (err: any, variables, context) => {
      if (context?.previousOrdersData) {
        queryClient.setQueryData(cacheQueryKey, context.previousOrdersData);
      }
      toast.error(err.message || "Tracking registration encountered an issue.");
    },
    onSuccess: () => toast.success("Tracking registered"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: cacheQueryKey }),
  });

  return {
    allOrders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    updateStatus: statusMutation.mutate,
    updateTracking: trackingMutation.mutate,
  };
}
