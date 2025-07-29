import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

export const getDownFormOrders = async () => {
  const response = await httpClient.get(API_END_POINT.DOWN_FORM_ORDERS);
  return response.data;
};