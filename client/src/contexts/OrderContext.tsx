import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useOrderData } from "@/hooks/orderManagement/useOrderData";
import type { OrderContextValue, OrderTab } from "@/shared/types";
import type { GridApi } from "ag-grid-community";
const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [activeOrderTab, setActiveOrderTabState] = useState<OrderTab>("registration");
  const [page, setPageState] = useState(1);
  const [currentTemplate, setCurrentTemplateState] = useState("");
  const [gridApi, setGridApiState] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRowsState] = useState<any[]>([]);
  const [changedRows, setChangedRowsState] = useState<any[]>([]);

  const setActiveOrderTab = useCallback((tab: OrderTab) => {
    setActiveOrderTabState(tab);
    setPageState(1);
  }, []);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setCurrentTemplate = useCallback((template: string) => {
    setCurrentTemplateState(template);
    setPageState(1);
  }, []);

  const { orderData, isLoading, error, refreshOrders } = useOrderData({ page, currentTemplate });

  const value: OrderContextValue = {
    activeOrderTab,
    setActiveOrderTab,
    page,
    setPage,
    currentTemplate,
    setCurrentTemplate,
    orderData,
    isLoading,
    error,
    refreshOrders,
    gridApi,
    setGridApi: setGridApiState,
    selectedRows,
    setSelectedRows: setSelectedRowsState,
    changedRows,
    setChangedRows: setChangedRowsState,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export function useOrderContext() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderContext must be used within an OrderProvider");
  return ctx;
} 