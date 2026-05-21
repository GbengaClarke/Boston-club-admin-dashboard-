import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../lib/apiProducts";

export function useAddProduct() {
  const queryClient = useQueryClient();

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: addProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return {
    createProduct,
    isCreating,
  };
}
