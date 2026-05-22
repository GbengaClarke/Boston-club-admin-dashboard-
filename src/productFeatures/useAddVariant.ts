// hooks/useAddVariant.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductVariant } from "../lib/apiProducts";

export function useAddVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProductVariant,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
