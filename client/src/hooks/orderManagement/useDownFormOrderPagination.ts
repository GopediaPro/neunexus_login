import { useQuery } from "@tanstack/react-query";
import { getDownFormOrdersPagination } from "@/api/order/getDownFormOrdersPagination";

interface UseDownFormOrderPaginationParams {
  page?: number;
  page_size?: number;
  template_code?: string;
  enabled?: boolean;
}

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