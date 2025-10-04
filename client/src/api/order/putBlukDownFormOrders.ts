import { API_END_POINT } from "@/constants";
import { httpClient } from "@/api/axios";
import type { BulkUpdateRequest } from "@/api/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const putBlukDownFormOrders = async (req: BulkUpdateRequest) => {
  const response = await httpClient.put(API_END_POINT.DOWN_FORM_ORDERS_BULK_UPDATE, req);
  return response.data;
}

export const useOrderUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: BulkUpdateRequest) => putBlukDownFormOrders(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("대량 수정 실패:", error);
    },
  });
};  