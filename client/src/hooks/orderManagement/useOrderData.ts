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
  const pendingRequestsRef = useRef<Set<string>>(new Set());


  const orderData = useMemo(() => {
    if (!data?.pages) return [];
    
    return data.pages.flatMap(page => 
      page?.items?.map((item: { content: OrderItem }) => item.content).filter(Boolean) || []
    );
  }, [data]);

  const createInfiniteDataSource = useCallback(() => {
    return {
      rowCount: undefined,
      
      getRows: async (params: any) => {
        const { startRow, endRow, successCallback, failCallback } = params;
        const requestId = `${startRow}-${endRow}`;
        
        try {
          if (pendingRequestsRef.current.has(requestId)) {
            return;
          }
          pendingRequestsRef.current.add(requestId);

          const currentData = orderData;
          
          if (startRow < currentData.length) {
            const availableData = currentData.slice(startRow, Math.min(endRow, currentData.length));
            
            if (endRow > currentData.length && hasNextPage && !isFetchingNextPage && !isLoadingMoreRef.current) {
              isLoadingMoreRef.current = true;
              
              try {
                await fetchNextPage();
              } catch (error) {
                failCallback();
              } finally {
                isLoadingMoreRef.current = false;
              }
              
              const updatedData = orderData;
              const finalData = updatedData.slice(startRow, Math.min(endRow, updatedData.length));
              
              const lastRow = hasNextPage ? -1 : updatedData.length;
              
              successCallback(finalData, lastRow);
            } else {
              const lastRow = hasNextPage ? -1 : currentData.length;
              successCallback(availableData, lastRow);
            }
          } else {
            if (hasNextPage && !isFetchingNextPage && !isLoadingMoreRef.current) {
              isLoadingMoreRef.current = true;
              
              try {
                await fetchNextPage();
                
                const updatedData = orderData;
                const requestedData = updatedData.slice(startRow, Math.min(endRow, updatedData.length));
                const lastRow = hasNextPage ? -1 : updatedData.length;
                
                successCallback(requestedData, lastRow);
              } catch (error) {
                failCallback();
              } finally {
                isLoadingMoreRef.current = false;
              }
            } else {
              successCallback([], currentData.length);
            }
          }
          
        } catch (error) {
          failCallback();
        } finally {
          pendingRequestsRef.current.delete(requestId);
        }
      }
    };
  }, [orderData, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    isLoadingMoreRef.current = false;
    pendingRequestsRef.current.clear();
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