import { getDownFormOrders } from "@/api/order/getDownFormOrders";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useOrderList = () => {
  return useInfiniteQuery({
    queryKey: ['downFormOrders'],
    queryFn: ({ pageParam = 0 }) => 
      getDownFormOrders({ skip: pageParam, limit: 2000 }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.items || lastPage.items.length < 2000) {
        return undefined;
      }
      return allPages.length * 2000;
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
  });
}; 