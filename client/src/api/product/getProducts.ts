import { httpClient } from '@/api/axios';
import { API_END_POINT } from '@/api/apiEndPoint';
import type { ProductListResponse, UseProductDataParams } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

interface GetProductsParams {
  limit?: number;   // 조회할 데이터 수
  skip?: number;    // 조회 시작 위치
}

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

export const useProductData = ({ search, limit = 50, skip = 0 }: UseProductDataParams = {}) => {

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', search, limit, skip],
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