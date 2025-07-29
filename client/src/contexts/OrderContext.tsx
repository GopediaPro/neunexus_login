import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useOrderData } from "@/hooks/orderManagement/useOrderData";
import type { FormTemplate, OrderContextValue, OrderTab } from "@/shared/types";
import type { GridApi } from "ag-grid-community";
const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [activeOrderTab, setActiveOrderTabState] = useState<OrderTab>("registration");
  const [currentTemplate, setCurrentTemplateState] = useState("");
  const [gridApi, setGridApiState] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRowsState] = useState<any[]>([]);
  const [changedRows, setChangedRowsState] = useState<any[]>([]);
  const { 
    orderData,
    currentPageCount,
    totalLoadedItems,
    hasMore: hasNextPage,
    isLoading: dataIsLoading,
    
    createInfiniteDataSource,
    
    isLoading,
    error,
    
    loadMoreOrders,
    refreshOrders,
    fetchNextPage,
    
    scrollPosition
  } = useOrderData();
  const isFetchingNextPage = dataIsLoading && totalLoadedItems > 0;

  const setActiveOrderTab = useCallback((tab: OrderTab) => {
    setActiveOrderTabState(tab);
    setSelectedRowsState([]);
    setChangedRowsState([]);
  }, []);

  const setCurrentTemplate = useCallback((template: FormTemplate) => {
    setCurrentTemplateState(template);
    setSelectedRowsState([]);
    setChangedRowsState([]);
  }, []);

  const setGridApi = useCallback((api: GridApi | null) => {
    setGridApiState(api);
    if (api) {
      setSelectedRowsState([]);
      setChangedRowsState([]);
    }
  }, []);

  const setSelectedRows = useCallback((rows: any[]) => {
    setSelectedRowsState(rows);
  }, []);

  const setChangedRows = useCallback((rows: any[]) => {
    setChangedRowsState(rows);
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedRowsState([]);
    setChangedRowsState([]);
    if (gridApi) {
      gridApi.deselectAll();
    }
  }, [gridApi]);

  const value: OrderContextValue = {
    // 탭 관리
    activeOrderTab,
    setActiveOrderTab,
    // 템플릿 관리
    currentTemplate: currentTemplate as FormTemplate,
    setCurrentTemplate,
    
    // 주문 데이터 (무한스크롤)
    orderData,
    createInfiniteDataSource,
    isLoading, 
    error, 
    loadMoreOrders, 
    hasMore: hasNextPage, 
    fetchNextPage,
    isFetchingNextPage,
    refreshOrders,
    totalLoadedItems,
    
    // 추가 메타 정보
    currentPageCount,
    scrollPosition,
    
    // 그리드 관리
    gridApi,
    setGridApi,
    selectedRows,
    setSelectedRows,
    changedRows,
    setChangedRows,
    clearSelections,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export function useOrderContext() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderContext must be used within an OrderProvider");
  return ctx;
} 