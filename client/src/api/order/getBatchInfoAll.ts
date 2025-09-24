import { API_END_POINT } from "@/constants";
import { httpClient } from "@/api/axios";
import type { BatchInfoParams, BatchInfoResponse } from "@/api/types/order.types"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";


// 사용
export const getBatchInfoAll = async (params?: BatchInfoParams): Promise<BatchInfoResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.page_size) searchParams.append('page_size', params.page_size.toString());

  const queryString = searchParams.toString();
  const url = queryString 
    ? `${API_END_POINT.MACRO_BATCH_INFO_ALL}?${queryString}`
    : API_END_POINT.MACRO_BATCH_INFO_ALL;

  const response = await httpClient.get(url);
  return response.data;
}



//미사용 
export const getBatchInfoLatest = async (params?: BatchInfoParams): Promise<BatchInfoResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.page_size) searchParams.append('page_size', params.page_size.toString());

  const queryString = searchParams.toString();
  const url = queryString 
    ? `${API_END_POINT.MACRO_BATCH_INFO_LATEST}?${queryString}`
    : API_END_POINT.MACRO_BATCH_INFO_LATEST;

  const response = await httpClient.get(url);
  return response.data;
}

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