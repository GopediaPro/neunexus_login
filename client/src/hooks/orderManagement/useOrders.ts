import { deleteBulkDownFormOrders } from "@/api/order/deleteBulkDownFormOrders";
import { getDownFormOrders } from "@/api/order/getDownFormOrders"
import { postBulkDownFormOrders } from "@/api/order/postBulkDownFormOrders";
import { putBlukDownFormOrders } from "@/api/order/putBlukDownFormOrders";
import type { BulkCreateRequest, BulkDeleteRequest, BulkUpdateRequest } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (templateCode: string, search?: string, page?: number) => [...orderKeys.lists(), templateCode, search, page] as const,
}

export const useOrders = ({ templateCode, search = '', page = 1 }: { templateCode: string; search?: string; page?: number }) => {
  return useQuery({
    queryKey: ['orders', templateCode, search, page],
    queryFn: () => getDownFormOrders({ template_code: templateCode, search, page }),
    enabled: !!templateCode && templateCode !== ''
  })
};

export const useBulkCreateOrders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (req: BulkCreateRequest) => postBulkDownFormOrders(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
    onError: (error) => {
      console.error('대량 생성 실패:', error)
    }
  })
}

export const useBulkUpdateOrders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (req: BulkUpdateRequest) => putBlukDownFormOrders(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
    onError: (error) => {
      console.error('대량 수정 실패:', error)
    }
  })
}

export const useBulkDeleteOrders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (req: BulkDeleteRequest) => deleteBulkDownFormOrders(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
    onError: (error) => {
      console.error('대량 삭제 실패:', error)
    }
  })
}