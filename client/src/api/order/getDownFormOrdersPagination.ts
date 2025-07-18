import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

interface GetDownFormOrdersPaginationParams {
  page?: number;
  page_size?: number;
  template_code?: string;
}

// 리팩토링때 any 타입 제거 후 repsonse값 넣어야함
interface DownFormOrderResponse {
  item: any;
  status: string;
  message: string;
}

interface PaginationResponse {
  total: number;
  page: number;
  page_size: number;
  items: DownFormOrderResponse[];
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