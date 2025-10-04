import { API_END_POINT } from "@/constants";
import { httpClient } from "@/api/axios";
import type { BulkDeleteRequest } from "@/api/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteBulkDownFormOrders = async (req: BulkDeleteRequest) => {
  const response = await httpClient.delete(API_END_POINT.DOWN_FORM_ORDERS_BULK_DELETE, { data: req });
  return response.data;
}


export const useOrderDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: BulkDeleteRequest) => deleteBulkDownFormOrders(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("대량 삭제 실패:", error);
    },
  });
}; 