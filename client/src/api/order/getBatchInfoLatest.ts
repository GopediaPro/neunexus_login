import { API_END_POINT } from "@/constant";
import { httpClient } from "@/api/axios";
import type { BatchInfoParams, BatchInfoResponse } from "@/api/types"

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