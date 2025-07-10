import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

export const getDownFormOrders = async ({ template_code }: { template_code: string }) => {
  const params = {
    template_code
  };
  const response = await httpClient.get(API_END_POINT.DOWN_FORM_ORDERS, { params });
  return response.data;
};