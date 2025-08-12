import { deleteBulkDownFormOrders } from "@/api/order/deleteBulkDownFormOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BulkDeleteRequest } from "@/api/types";

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