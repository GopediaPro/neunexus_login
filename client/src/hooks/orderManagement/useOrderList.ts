import { getDownFormOrders } from "@/api/order/getDownFormOrders";
import { useQuery } from "@tanstack/react-query";


export const useOrderList = () => {
  return useQuery({
    queryKey: ['downFormOrders'],
    queryFn: () => getDownFormOrders({ skip: 0, limit: 200 }),
  });
}; 