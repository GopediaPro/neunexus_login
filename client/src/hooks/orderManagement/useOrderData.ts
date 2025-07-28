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

  const requestManagerRef = useRef({
    pendingRequests: new Set<string>(),
    isLoadingMore: false,
    scrollPosition: 0
  });

  const orderData = useMemo(() => {
    if (!data?.pages) return [];
    
    return data.pages.flatMap(page => 
      page?.items?.map((item: { content: OrderItem }) => item.content).filter(Boolean) || []
    );
  }, [data]);

  const dataInfo = useMemo(() => ({
    currentPageCount: data?.pages?.length || 0,
    totalLoadedItems: orderData.length,
    hasMore: hasNextPage,
    isLoading: isLoading || isFetchingNextPage
  }), [data?.pages, orderData.length, hasNextPage, isLoading, isFetchingNextPage]);

  const handleDataRequest = useCallback(async (
    startRow: number, 
    endRow: number,
    successCallback: (data: OrderItem[], lastRow: number) => void,
    failCallback: () => void
  ) => {
    const currentData = [...orderData];
    
    try {
      if (startRow < currentData.length) {
        const availableData = currentData.slice(startRow, Math.min(endRow, currentData.length));
        
        if (endRow > currentData.length && hasNextPage && !requestManagerRef.current.isLoadingMore) {
          requestManagerRef.current.isLoadingMore = true;
          
          try {
            await fetchNextPage();
            
            const newData = [...orderData];
            const finalData = newData.slice(startRow, Math.min(endRow, newData.length));
            const lastRow = hasNextPage ? -1 : newData.length;
            
            successCallback(finalData, lastRow);
          } catch (error) {
            const lastRow = hasNextPage ? -1 : currentData.length;
            successCallback(availableData, lastRow);
          } finally {
            requestManagerRef.current.isLoadingMore = false;
          }
        } else {
          const lastRow = hasNextPage ? -1 : currentData.length;
          successCallback(availableData, lastRow);
        }
      } 
      else {
        if (hasNextPage && !requestManagerRef.current.isLoadingMore) {
          requestManagerRef.current.isLoadingMore = true;
          
          try {
            await fetchNextPage();
            
            const newData = [...orderData];
            const requestedData = newData.slice(startRow, Math.min(endRow, newData.length));
            const lastRow = hasNextPage ? -1 : newData.length;

            successCallback(requestedData, lastRow);
          } catch (error) {
            failCallback();
          } finally {
            requestManagerRef.current.isLoadingMore = false;
          }
        } else {
          successCallback([], currentData.length);
        }
      }
    } catch (error) {
      failCallback();
    }
  }, [orderData, hasNextPage, fetchNextPage]);

  const createInfiniteDataSource = useCallback(() => {
    return {
      rowCount: undefined,
      
      getRows: async (params: any) => {
        const { startRow, endRow, successCallback, failCallback } = params;
        const requestId = `${startRow}-${endRow}`;
        
        if (requestManagerRef.current.pendingRequests.has(requestId)) {
          return;
        }
        
        requestManagerRef.current.pendingRequests.add(requestId);
        
        try {
          await handleDataRequest(startRow, endRow, successCallback, failCallback);
        } finally {
          requestManagerRef.current.pendingRequests.delete(requestId);
        }
      }
    };
  }, [handleDataRequest]);

  const loadMoreOrders = useCallback(() => {
    if (hasNextPage && !requestManagerRef.current.isLoadingMore) {
      requestManagerRef.current.isLoadingMore = true;
      requestManagerRef.current.scrollPosition = window.scrollY;
      
      fetchNextPage().finally(() => {
        requestManagerRef.current.isLoadingMore = false;
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const refreshOrders = useCallback(() => {
    requestManagerRef.current.scrollPosition = 0;
    requestManagerRef.current.isLoadingMore = false;
    requestManagerRef.current.pendingRequests.clear();
    refetch();
  }, [refetch]);

  return {
    // 데이터
    orderData,
    ...dataInfo,
    
    // 무한 스크롤
    createInfiniteDataSource,
    
    // 상태
    isLoading,
    error,
    
    // 액션
    loadMoreOrders,
    refreshOrders,
    fetchNextPage,
    
    // 메타 정보
    scrollPosition: requestManagerRef.current.scrollPosition,
  };
};