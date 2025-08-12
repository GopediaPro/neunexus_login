import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/product/getProducts";
import type { UseProductDataParams } from "@/api/types";

export const useProductData = ({ search, page }: UseProductDataParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', search, page],
    queryFn: () => getProducts({ search, page }),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const productData = data?.products || [];

  const refreshProducts = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    productData,
    isLoading,
    error,
    refreshProducts
  };
};