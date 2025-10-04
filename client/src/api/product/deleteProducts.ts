import { API_END_POINT } from "@/api/apiEndPoint";
import { httpClient } from '@/api/axios';
import type { ProductDeleteRequest, ProductDeleteResponse } from "@/api/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

export const deleteProducts = async (request: ProductDeleteRequest): Promise<ProductDeleteResponse> => {
  const response = await httpClient.delete(API_END_POINT.PRODUCT_REGISTRATION_BULK, {
    data: request
  });
  return response.data;
}

export const useProductDelete = (options?: {
  onSuccess?: (data: ProductDeleteResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  
  return useMutation<ProductDeleteResponse, Error, ProductDeleteRequest>({
    mutationFn: deleteProducts,
    onSuccess: (data) => {
      const successCount = data.data.success_count || 0;
      const errorCount = data.data.error_count || 0;

      if (errorCount > 0) {
        // 실패한 항목들의 메시지 표시
        const failedItems = data.data.items.filter(item => item.status === 'error');
        const errorMessages = failedItems.map(item => `ID ${item.id}: ${item.message}`).join('\n');
        toast.warning(`${errorCount}개 상품 삭제 실패\n${errorMessages}`);
      } else if (successCount > 0) {
        toast.success(`${successCount}개 상품이 삭제되었습니다`)
      }
      
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ['productsList'] });
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("상품 삭제 실패", error.message);
      toast.error("상품 삭제 중 오류가 발생했습니다");
      options?.onError?.(error);
    }
  })
}