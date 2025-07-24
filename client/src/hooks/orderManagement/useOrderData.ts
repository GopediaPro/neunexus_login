import { useCallback, useMemo, useRef } from "react";
import { useOrderList } from "./useOrderList";
import type { OrderItem } from "@/shared/types";

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
      page?.items?.map((item: { content: OrderItem }) => item.content).filter(Boolean) || []
    );
  }, [data]);

  const createInfiniteDataSource = useCallback(() => {
    return {
      rowCount: undefined,
      getRows: (params: any) => {
        const startRow = params.startRow;
        const endRow = params.endRow;
        const currentData = orderData;
        
        if (startRow < currentData.length) {
          const rowsThisPage = currentData.slice(startRow, Math.min(endRow, currentData.length));
          
          if (endRow > currentData.length && hasNextPage && !isFetchingNextPage) {
            loadMoreOrders();
          }
          
          const lastRow = hasNextPage ? -1 : currentData.length;
          
          params.successCallback(rowsThisPage, lastRow);
        } else {
          params.successCallback([], hasNextPage ? -1 : currentData.length);
        }
      }
    };
  }, [orderData, hasNextPage, isFetchingNextPage]);

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
    createInfiniteDataSource,
    isLoading,
    error,
    loadMoreOrders,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refreshOrders,
    currentPageCount,
    totalLoadedItems,
    scrollPosition: scrollPositionRef.current,
  };
};