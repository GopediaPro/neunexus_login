import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useOrderData } from "@/hooks/orderManagement/useOrderData";
import type { DataFilterTab, FormTemplate, OrderContextValue } from "@/api/types";
import type { GridApi } from "ag-grid-community";
const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [activeOrderTab, setActiveOrderTabState] = useState<DataFilterTab>("all");
  const [currentTemplate, setCurrentTemplateState] = useState("");
  const [gridApi, setGridApiState] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRowsState] = useState<any[]>([]);
  const [changedRows, setChangedRowsState] = useState<any[]>([]);
  const { 
    orderData,
    isLoading: dataIsLoading,
    error,
  } = useOrderData();

  const setActiveOrderTab = useCallback((tab: DataFilterTab) => {
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
    const filteredRows = rows.filter(row => {
      if (row.id && String(row.id).startsWith('temp_')) {
        return false;
      }
      
      if (!row.order_id || row.status === 'pending' || row.isTemp) {
        return false;
      }
      
      return true;
    });
    
    setSelectedRowsState(filteredRows);
  }, []);

  const setChangedRows = useCallback((rows: any[]) => {
    const filteredRows = rows.filter(row => {
      if (row.id && String(row.id).startsWith('temp_')) {
        return false;
      }
      
      if (!row.order_id || row.status === 'pending' || row.isTemp) {
        return false;
      }
      
      return true;
    });
    
    setChangedRowsState(filteredRows);
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedRowsState([]);
    setChangedRowsState([]);
    if (gridApi) {
      gridApi.deselectAll();
    }
  }, [gridApi]);

  const value: OrderContextValue = {
    activeOrderTab,
    setActiveOrderTab,
    currentTemplate: currentTemplate as FormTemplate,
    setCurrentTemplate,
    orderData,
    isLoading: dataIsLoading, 
    error, 
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