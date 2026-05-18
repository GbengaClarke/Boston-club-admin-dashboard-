import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../lib/apiProducts";

export function useGetProduct(id: string | undefined) {
  const { data, isPending, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return { data, isPending, error };
}
