import { httpClient } from '@/api/axios';
import { API_END_POINT } from '@/api/apiEndPoint';
import type { ProductListResponse, GetProductsParams, UseProductDataParams } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export const getProducts = async (
  params: GetProductsParams
): Promise<ProductListResponse> => {
  try {
    const { limit = 50, skip = 0 } = params;

    const response = await httpClient.get<ProductListResponse>(API_END_POINT.PRODUCTS, {
      params: {
        limit,
        skip
      }
    });
    return response.data;

  } catch (error) {
    console.error('상품 목록 로딩 실패:', error);
    throw error;
  }
};

export const useProductData = ({ search, page = 1, limit = 50 }: UseProductDataParams = {}) => {
  const skip = (page - 1) * limit;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', search, page, limit],
    queryFn: () => getProducts({ limit, skip }),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const productData = data?.product_registration_dto_list || [];
  const totalCount = data?.item_count || 0;
  const refreshProducts = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    productData,
    totalCount,
    isLoading,
    error,
    refreshProducts
  };
};