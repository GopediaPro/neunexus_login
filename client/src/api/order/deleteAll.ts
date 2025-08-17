import { API_END_POINT } from "@/api/apiEndPoint";
import { httpClient } from "@/api/axios";

export const deleteAll = async () => {
  const response = await httpClient.delete(`${API_END_POINT.DOWN_FORM_ORDERS_DELETE_ALL}`);
  
  return response.data;
}