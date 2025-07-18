import { getDownFormOrders } from "@/api/order/getDownFormOrders";
import { useQuery } from "@tanstack/react-query";

export const useOrderList = ({ page = 1 }: { page?: number }) => {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => getDownFormOrders({ skip: (page - 1) * 200, limit: 200 }),
  });
}; 