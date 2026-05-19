import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { deleteProduct as deleteProductApi } from "../lib/apiProducts";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteProduct } = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      toast.success("Product successfully deleted");

      // Invalidate the cache to refresh the product list
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { isDeleting, deleteProduct };
}
