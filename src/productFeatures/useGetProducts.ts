import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../lib/apiProducts";

export function useGetProducts() {
  const {
    isLoading,
    data: products,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return { isLoading, products, error };
}
