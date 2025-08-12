import { API_END_POINT } from "@/constant/apiEndPoint";
import { httpClient } from "@/api/axios";

export const deleteDuplicate = async () => {
  const response = await httpClient.delete(`${API_END_POINT.DOWN_FORM_ORDERS_DELETE_DUPLICATE}`);
  return response.data;
}