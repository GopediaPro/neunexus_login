import { API_END_POINT } from "@/constant";
import { httpClient } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export const getDownFormOrders = async ({
  limit = 2000,
}: {
  limit?: number;
}) => {
  const params: Record<string, any> = {
    limit
  };

  const response = await httpClient.get(API_END_POINT.DOWN_FORM_ORDERS, { params, timeout: 100000 });
  return response.data;
};


export const useOrderList = () => {
  return useQuery({
    queryKey: ['downFormOrders'],
    queryFn: () => getDownFormOrders({ limit: 2000 }),
  });
}; 