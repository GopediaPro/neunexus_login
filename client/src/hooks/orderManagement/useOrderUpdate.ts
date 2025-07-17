import { putBlukDownFormOrders } from "@/api/order/putBlukDownFormOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BulkUpdateRequest } from "@/shared/types";

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