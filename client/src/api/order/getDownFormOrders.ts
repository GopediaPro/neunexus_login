import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

export const getDownFormOrders = async ({ template_code, search, page }: { template_code: string; search?: string; page?: number }) => {
  const params: Record<string, any> = {
    template_code
  };
  if (search) params.search = search;
  if (page) params.page = page;
  const response = await httpClient.get(API_END_POINT.DOWN_FORM_ORDERS, { params });
  return response.data;
};