import { getBatchInfoAll } from "@/api/order/getBatchInfoAll";
import { getBatchInfoLatest } from "@/api/order/getBatchInfoLatest";
import { useQuery } from "@tanstack/react-query";
import type { BatchInfoParams, BatchInfoResponse } from "@/api/types";
import type { UseQueryOptions } from "@tanstack/react-query";

export const useBatchInfoAll = (
  params?: BatchInfoParams,
  options?: UseQueryOptions<BatchInfoResponse>
) => {
  return useQuery({
    queryKey: ['batchInfo', 'all', params],
    queryFn: () => getBatchInfoAll(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useBatchInfoLatest = (
  params?: BatchInfoParams,
  options?: UseQueryOptions<BatchInfoResponse>
) => {
  return useQuery({
    queryKey: ['batchInfo', 'latest', params],
    queryFn: () => getBatchInfoLatest(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}; 