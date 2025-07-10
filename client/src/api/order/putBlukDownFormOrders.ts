import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";
import type { BulkUpdateRequest } from "@/shared/types";

export const putBlukDownFormOrders = async (req: BulkUpdateRequest) => {
  const response = await httpClient.put(API_END_POINT.DOWN_FORM_ORDERS_BULK_UPDATE, req);
  return response.data;
}