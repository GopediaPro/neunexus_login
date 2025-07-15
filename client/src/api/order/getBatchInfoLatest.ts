import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";
import type { BatchInfoParams, BatchInfoResponse } from "@/shared/types"

export const getBatchInfoLatest = async (params?: BatchInfoParams): Promise<BatchInfoResponse> => {
  const searchParams = new URLSearchParams({
    page: (params?.page || 1).toString(),
    page_size: (params?.page_size || 100).toString()
  });

  const response = await httpClient.get(`${API_END_POINT.DOWN_FORM_BATCH_INFO_LATEST}?${searchParams}`);

  return response.data;
}