import { httpClient } from '@/api/axios';
import { API_END_POINT } from '@/api/apiEndPoint';
import type { ProductListResponse, GetProductsParams, UseProductDataParams } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const getProducts = async (
  params: GetProductsParams
): Promise<ProductListResponse> => {
  try {
    const response = await httpClient.get(API_END_POINT.PRODUCTS, {
      params
    });

    return response.data;
  } catch (error) {
    console.error('상품 목록 로딩 실패:', error);
    throw error;
  }
};

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