import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVariant } from "../lib/apiProducts";

export function useDeleteVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVariant,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      queryClient.invalidateQueries({
        queryKey: ["product", variables.product_id],
      });
    },
  });
}
