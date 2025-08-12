import { API_END_POINT } from "@/constant";
import { httpClient } from "@/api/axios";

export const postBulkWithoutFilter = async (data: any) => {
  const response = await httpClient.post(`${API_END_POINT.DOWN_FORM_ORDERS_BULK_WITHOUT_FILTER}`, data);
  return response.data;
}