import { httpClient } from '@/api/axios';
import { API_END_POINT } from '@/api/apiEndPoint';
import type { ProductListResponse, GetProductsParams } from '@/api/types';

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
