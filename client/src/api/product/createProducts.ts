import { httpClient } from '@/api/axios';
import { API_END_POINT } from '@/api/apiEndPoint';
import type { ProductFormData, ProductCreateRequest, ProductBulkResponse } from '@/api/types';

const requestId = (): string => {
  const now = new Date();
  const random = Math.random().toString(36).substring(2, 11);
  return `req-${now}-${random}`;
};

export const createProducts = async (
  products: ProductFormData[]
): Promise<ProductBulkResponse> => {
  try {
    if (!products || products.length === 0) {
      throw new Error('등록할 상품이 없습니다');
    }

    const request: ProductCreateRequest = {
      data: products,
      metadata: {
        request_id: requestId()
      }
    };

    const response = await httpClient.post<ProductBulkResponse>(
      API_END_POINT.PRODUCT_REGISTRATION_BULK,
      request
    );

    if (response.data?.data?.error_count > 0) {
      console.warn('일부 상품 등록 실패:', response.data.data.errors);
    }
    return response.data;
  } catch (error: any) {
    console.error('상품 벌크 등록 실패:', {
      error,
      message: error?.message,
      response: error?.response?.data
    });
    
    const errorMessage = error?.response?.data?.message || error?.message || '상품 등록에 실패했습니다';
    throw new Error(errorMessage);
  }
};