import { getDownFormOrders } from "@/api/order/getDownFormOrders";
import { useQuery } from "@tanstack/react-query";

export const useOrderList = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ['downFormOrders', page],
    queryFn: () => getDownFormOrders({ skip: (page - 1) * 200, limit: 200 }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}; 