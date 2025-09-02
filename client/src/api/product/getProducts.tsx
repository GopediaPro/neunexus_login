import { httpClient } from '@/api/axios';
import { API_END_POINT } from '@/api/apiEndPoint';
import type { ProductListResponse, GetProductsParams, UseProductDataParams } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const getProducts = async (
  params: GetProductsParams
): Promise<ProductListResponse> => {
  try {
    const { limit = 100, offset = 0 } = params;

    const response = await httpClient.get<ProductListResponse>(API_END_POINT.PRODUCTS, {
      params: {
        limit,
        offset
      }
    });

    return response.data;
  } catch (error) {
    console.error('상품 목록 로딩 실패:', error);
    throw error;
  }
};

export const useProductData = ({ search, page = 1, limit = 1 }: UseProductDataParams = {}) => {
  // TODO: limit 기본값 100으로 변경
  const offset = (page - 1) * limit;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', search, page, limit],
    queryFn: () => getProducts({ limit, offset }),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const productData = data || [];

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