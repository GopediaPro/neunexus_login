import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

export const postBulkFilter = async (data: any) => {
  const response = await httpClient.post(`${API_END_POINT.DOWN_FORM_ORDERS_BULK_FILTER}`, data);
  return response.data;
}