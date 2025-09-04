import { httpClient } from '@/api/axios';
import { API_END_POINT } from '@/api/apiEndPoint';
import type { ProductFormData, ProductCreateRequest, ProductBulkResponse } from '@/api/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

interface UseProductsCreateOptions {
  onSuccess?: (data: ProductBulkResponse) => void;
  onError?: (error: Error) => void;
}

export const useProductsCreate = (options?: UseProductsCreateOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ProductBulkResponse, Error, ProductFormData[]>({
    mutationFn: createProducts,
    onSuccess: (data) => {
      const successCount = data.data?.success_count || 0;
      const errorCount = data.data?.error_count || 0;

      if (errorCount > 0) {
        toast.warning(`${successCount}개 상품이 등록되었고, ${errorCount}개 상품이 실패했습니다.`);
        console.error('실패한 상품:', data.data?.errors);
      } else if (successCount > 0) {
        toast.success(`${successCount}개 상품이 성공적으로 등록되었습니다.`);
      }

      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productsList'] });

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || '상품 등록 중 오류가 발생했습니다.');
      options?.onError?.(error);
    },
    retry: 1,
    retryDelay: 1000,
  });
};