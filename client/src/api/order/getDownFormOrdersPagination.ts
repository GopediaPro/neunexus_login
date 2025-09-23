import { API_END_POINT } from "@/constants";
import { httpClient } from "@/api/axios";
import type { GetDownFormOrdersPaginationParams, PaginationResponse } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

export interface UseDownFormOrderPaginationParams extends GetDownFormOrdersPaginationParams {
  enabled?: boolean;
}

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

export const useDownFormOrderPagination = ({
  page,
  page_size,
  template_code,
  enabled = true,
}: UseDownFormOrderPaginationParams = {}) => {
  return useQuery({
    queryKey: ['downFormOrdersPagination', page, page_size, template_code],
    queryFn: () => getDownFormOrdersPagination({ page, page_size, template_code }),
    enabled,
    refetchOnWindowFocus: false,
  });
};