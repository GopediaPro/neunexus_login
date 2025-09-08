import { httpClient } from '@/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_END_POINT } from '../apiEndPoint';
import { toast } from 'sonner';

export interface OrderCreateRequest {
  data: {
    filters: {
      date_from: string;
      date_to: string;
      dpartner_id: string;
      fld_dsp: string;
      order_status: string;
    };
  };
  metadata: {
    request_id: string;
  };
}

export interface OrderCreateResponse {
  success: boolean;
  data: {
    success: boolean;
    fld_dsp: string;
    dpartner_id: string;
    processed_count: number;
    saved_count: number;
    message: string;
  };
  metadata: {
    version: string;
    request_id: string;
  };
}

export const postOrderCreate = async (req: OrderCreateRequest) => {
  const response = await httpClient.post(API_END_POINT.CREATE_FROM_RECEIVE_ORDERS, req);
  return response.data;
};

interface UseOrderCreateFromReceiveOptions {
  onSuccess?: (data: OrderCreateResponse) => void;
  onError?: (error: any) => void;
}

export const useOrderCreateFromReceive = (options?: UseOrderCreateFromReceiveOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: OrderCreateRequest) => postOrderCreate(req),
    onSuccess: (data: OrderCreateResponse) => {
      toast.success('주문 수집 성공');
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);

      console.error("주문 수집 실패:", error);
    },
  });
};