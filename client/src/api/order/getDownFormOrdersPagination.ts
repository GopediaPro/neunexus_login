import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

export const getDownFormOrdersPagination = async (params: any) => {
  const response = await httpClient.get(`${API_END_POINT.DOWN_FORM_ORDERS_PAGINATION}`, { params });
  return response.data;
}