import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";
import type { BulkDeleteRequest } from "@/shared/types";

export const deleteBulkDownFormOrders = async (req: BulkDeleteRequest) => {
  const response = await httpClient.delete(API_END_POINT.DOWN_FORM_ORDERS_BULK_DELETE, { data: req });
  return response.data;
}