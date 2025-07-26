import { getDownFormOrders } from "@/api/order/getDownFormOrders";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useOrderList = () => {
  return useInfiniteQuery({
    queryKey: ['downFormOrders'],
    queryFn: ({ pageParam = 0 }) => 
      getDownFormOrders({ skip: pageParam, limit: 200 }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.items || lastPage.items.length < 200) {
        return undefined;
      }
      return allPages.length * 200;
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
  });
}; 