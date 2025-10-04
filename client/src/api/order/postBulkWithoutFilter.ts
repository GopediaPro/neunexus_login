import { API_END_POINT } from "@/constants";
import { httpClient } from "@/api/axios";
// 미사용 
export const postBulkWithoutFilter = async (data: any) => {
  const response = await httpClient.post(`${API_END_POINT.DOWN_FORM_ORDERS_BULK_WITHOUT_FILTER}`, data);
  return response.data;
}