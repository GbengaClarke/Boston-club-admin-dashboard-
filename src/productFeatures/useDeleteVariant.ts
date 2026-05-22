import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVariant } from "../lib/apiProducts";

export function useDeleteVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVariant,

    onSuccess: (_, variables) => {
      // refresh products list
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // optionally invalidate single product if cached
      queryClient.invalidateQueries({
        queryKey: ["product", variables.product_id],
      });
    },
  });
}
