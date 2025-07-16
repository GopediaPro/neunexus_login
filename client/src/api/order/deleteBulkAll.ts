import { API_END_POINT } from "@/constant/apiEndPoint";
import { httpClient } from "@/shared/axios";

export const deleteBulkAll = async () => {
  const response = await httpClient.delete(`${API_END_POINT.DOWN_FORM_ORDERS_BULK_DELETE_ALL}`);
  
  return response.data;
}