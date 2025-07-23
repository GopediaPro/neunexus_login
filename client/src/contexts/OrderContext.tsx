import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useOrderData } from "@/hooks/orderManagement/useOrderData";
import type { OrderContextValue, OrderTab } from "@/shared/types";
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
    isLoading, 
    error, 
    loadMoreOrders, 
    hasNextPage, 
    isFetchingNextPage 
  } = useOrderData();

  const setActiveOrderTab = useCallback((tab: OrderTab) => {
    setActiveOrderTabState(tab);
    setSelectedRowsState([]);
    setChangedRowsState([]);
  }, []);

  const setCurrentTemplate = useCallback((template: string) => {
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
    currentTemplate,
    setCurrentTemplate,
    
    // 주문 데이터 (무한스크롤)
    orderData, 
    isLoading, 
    error, 
    loadMoreOrders, 
    hasNextPage, 
    isFetchingNextPage,
    
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