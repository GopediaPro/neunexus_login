import { API_END_POINT } from "@/api/apiEndPoint";
import { httpClient } from '@/api/axios';
import type { ProductBulkResponse, ProductUpdateRequest } from "@/api/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

export const updateProducts = async (request: ProductUpdateRequest): Promise<ProductBulkResponse> => {
  const response = await httpClient.put(API_END_POINT.PRODUCT_REGISTRATION_BULK, request);
  return response.data;
}

export const useProductUpdate = (options?: {
  onSuccess?: (data: ProductBulkResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  
  return useMutation<ProductBulkResponse, Error, ProductUpdateRequest>({
    mutationFn: updateProducts,
    onSuccess: (data) => {
      const successCount = data.data.success_count || 0;
      const errorCount = data.data.error_count || 0;

      if (errorCount > 0) {
        toast.warning(`${errorCount}개 상품 수정 실패`);
      } else if (successCount > 0) {
        toast.success(`${successCount}개 상품 수정 성공`)
      }
      
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ['productsList'] });
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("대량 수정 실패", error.message);
      options?.onError?.(error);
    }
  })
}