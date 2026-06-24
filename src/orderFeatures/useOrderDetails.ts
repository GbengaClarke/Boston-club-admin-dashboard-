import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

export function useOrderDetails(
  orderId: string,
  orderNumber?: string,
  onClose?: () => void
) {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order_items", orderId],
    queryFn: async () => {
      if (!supabase || !orderId) return [];

      const { data, error } = await supabase
        .from("order_items")
        .select(
          `
          id, quantity, unit_price,
          products (name, category, material),
          product_images (color_name,image_url)
        `
        )
        .eq("order_id", orderId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!orderId,
    staleTime: 5000,
  });

  // Complete cascading deletion mutation handler
  const deleteOrderMutation = useMutation({
    mutationFn: async () => {
      if (!supabase || !orderId) return;

      //  Delete associated child order items first to satisfy relational integrity constraints
      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      //  Delete the parent core transaction ledger order entry
      const { error: orderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (orderError) throw orderError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onClose?.();
      toast.success(
        `Order #BC-${orderNumber || ""} has been deleted from records.`
      );
    },
    onError: (error) => {
      console.error(
        "Critical Operational Error: Failure to purge database records:",
        error
      );
      toast.error(
        "Failed to delete transaction record. Check administrative permissions."
      );
    },
  });

  return {
    items,
    isLoading,
    isError,
    deleteOrder: deleteOrderMutation.mutate,
    isDeleting: deleteOrderMutation.isPending,
  };
}
