import { postBulkDownFormOrders } from "@/api/order/postBulkDownFormOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BulkCreateRequest } from "@/shared/types";

export const useOrderCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: BulkCreateRequest) => postBulkDownFormOrders(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("대량 생성 실패:", error);
    },
  });
}; 