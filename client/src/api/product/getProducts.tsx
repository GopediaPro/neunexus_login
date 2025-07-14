import { httpClient } from '@/shared/axios';
import { API_END_POINT } from '@/constant/apiEndPoint';
import type { ProductData } from '@/shared/types/product.types';

export interface ProductListResponse {
  products: ProductData[];
  current_page: number;
  page_size: string;
}

export interface GetProductsParams {
  search: string;
  page: number;
}

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
