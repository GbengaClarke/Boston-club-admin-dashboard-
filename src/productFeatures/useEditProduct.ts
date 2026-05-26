import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  updateProductAndVariants,
  UpdateProductPayload,
} from "../lib/apiProducts";

export function useEditProduct() {
  const queryClient = useQueryClient();

  const { mutate: editProduct, isPending: isEditing } = useMutation({
    mutationFn: (payload: UpdateProductPayload) =>
      updateProductAndVariants(payload),
    onSuccess: () => {
      toast.success("Product configurations updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "An error occurred updating the catalog");
    },
  });

  return { editProduct, isEditing };
}
