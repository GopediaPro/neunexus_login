import { API_END_POINT } from "@/constants";
import { httpClient } from "@/api/axios";
import type { BulkCreateRequest, DownFormBulkCreateResponse } from "@/api/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const postBulkDownFormOrders = async (req: BulkCreateRequest) => {
    const response = await httpClient.post(API_END_POINT.DOWN_FORM_ORDERS_BULK_CREATE, req);
    return response.data;
};

interface UseOrderCreateOptions {
    onSuccess?: (data: DownFormBulkCreateResponse) => void;
    onError?: (error: any) => void;
  }
  

export const useOrderCreate = (options?: UseOrderCreateOptions) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (req: BulkCreateRequest) => postBulkDownFormOrders(req),
      onSuccess: (data: DownFormBulkCreateResponse) => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        options?.onError?.(error);
  
        console.error("대량 생성 실패:", error);
      },
    });
  }; 

  