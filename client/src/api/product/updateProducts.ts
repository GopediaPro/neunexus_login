import { API_END_POINT } from "@/api/apiEndPoint";
import { httpClient } from '@/api/axios';
import type { ProductUpdateRequest } from "@/api/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const updateProducts = async (request: ProductUpdateRequest) => {
  const response = await httpClient.put(API_END_POINT.PRODUCT_REGISTRATION_BULK, request);
  return response.data;
}

export const useProductUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ProductUpdateRequest) => updateProducts(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("대량 수정 실패", error);
    }
  })
}