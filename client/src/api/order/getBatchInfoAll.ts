import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";
import type { BatchInfoParams, BatchInfoResponse } from "@/shared/types"

export const getBatchInfoAll = async (params?: BatchInfoParams): Promise<BatchInfoResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.page_size) searchParams.append('page_size', params.page_size.toString());

  const response = await httpClient.get(`${API_END_POINT.DOWN_FORM_BATCH_INFO_ALL}?${searchParams}`);

  return response.data;
}