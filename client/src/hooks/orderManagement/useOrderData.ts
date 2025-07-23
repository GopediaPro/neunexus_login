import { useCallback, useMemo, useRef } from "react";
import { useOrderList } from "./useOrderList";

export const useOrderData = () => {
  const { 
    data, 
    isLoading, 
    error,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = useOrderList();

  const scrollPositionRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);

  const orderData = useMemo(() => {
    if (!data?.pages) return [];
    
    return data.pages.flatMap(page => 
      page?.items?.map((item: { content: any; }) => item.content).filter(Boolean) || []
    );
  }, [data]);

  const currentPageCount = useMemo(() => {
    return data?.pages?.length || 0;
  }, [data?.pages]);

  const totalLoadedItems = useMemo(() => {
    return orderData.length;
  }, [orderData.length]);

  const loadMoreOrders = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoadingMoreRef.current) {
      isLoadingMoreRef.current = true;
      scrollPositionRef.current = window.scrollY;
      
      fetchNextPage().finally(() => {
        isLoadingMoreRef.current = false;
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const refreshOrders = useCallback(() => {
    scrollPositionRef.current = 0;
    refetch();
  }, [refetch]);

  return {
    orderData,
    isLoading,
    error,
    loadMoreOrders,
    hasNextPage,
    isFetchingNextPage,
    refreshOrders,
    currentPageCount,
    totalLoadedItems,
    scrollPosition: scrollPositionRef.current,
  };
};