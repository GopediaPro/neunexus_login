import { API_END_POINT } from "@/constant";
import { httpClient } from "@/api/axios";
import type { GetDownFormOrdersPaginationParams, PaginationResponse } from "@/api/types";

export const getDownFormOrdersPagination = async ({ 
  page = 1, 
  page_size = 100, 
  template_code 
}: GetDownFormOrdersPaginationParams = {}): Promise<PaginationResponse> => {
  const params: Record<string, any> = {
    page,
    page_size
  };
  
  if (template_code !== undefined) {
    params.template_code = template_code;
  }
  
  const response = await httpClient.get(API_END_POINT.DOWN_FORM_ORDERS_PAGINATION, { params });
  return response.data;
};