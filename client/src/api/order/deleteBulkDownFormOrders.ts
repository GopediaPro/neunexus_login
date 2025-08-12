import { API_END_POINT } from "@/constant";
import { httpClient } from "@/api/axios";
import type { BulkDeleteRequest } from "@/api/types";

export const deleteBulkDownFormOrders = async (req: BulkDeleteRequest) => {
  const response = await httpClient.delete(API_END_POINT.DOWN_FORM_ORDERS_BULK_DELETE, { data: req });
  return response.data;
}