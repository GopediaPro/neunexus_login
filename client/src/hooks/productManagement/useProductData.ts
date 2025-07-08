import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/getProducts";

export const useProductData = () => {
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', page],
    queryFn: () => getProducts(page),
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