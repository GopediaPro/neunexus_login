import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { useOrderData } from "@/hooks/orderManagement/useOrderData";
import type { DataFilterTab, FormTemplate, OrderContextValue, OrderItem } from "@/api/types";
import type { GridApi } from "ag-grid-community";

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [activeOrderTab, setActiveOrderTabState] = useState<DataFilterTab>("all");
  const [currentTemplate, setCurrentTemplateState] = useState<FormTemplate>("gmarket_erp");
  const [gridApi, setGridApiState] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRowsState] = useState<OrderItem[]>([]);
  const [changedRows, setChangedRowsState] = useState<OrderItem[]>([]);
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

  const setSelectedRows = useCallback((rows: OrderItem[]) => {
    const filteredRows = rows.filter(row => {
      if (row.id && String(row.id).startsWith('temp_')) {
        return false;
      }
      
      const rowWithStatus = row as OrderItem & { status?: string; isTemp?: boolean };
      if (!row.order_id || rowWithStatus.status === 'pending' || rowWithStatus.isTemp) {
        return false;
      }
      
      return true;
    });
    
    setSelectedRowsState(filteredRows);
  }, []);

  const setChangedRows = useCallback((rows: OrderItem[]) => {
    const filteredRows = rows.filter(row => {
      if (row.id && String(row.id).startsWith('temp_')) {
        return false;
      }
      
      const rowWithStatus = row as OrderItem & { status?: string; isTemp?: boolean };
      if (!row.order_id || rowWithStatus.status === 'pending' || rowWithStatus.isTemp) {
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

  const computedValues = useMemo(() => ({
    hasSelectedRows: selectedRows.length > 0,
    hasChangedRows: changedRows.length > 0,
    selectedRowCount: selectedRows.length,
    changedRowCount: changedRows.length,
    isGridReady: !!gridApi,
    hasData: orderData.length > 0,
  }), [selectedRows.length, changedRows.length, gridApi, orderData.length]);

  const value: OrderContextValue = {
    activeOrderTab,
    setActiveOrderTab,
    currentTemplate,
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
    ...computedValues,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export function useOrderContext() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderContext must be used within an OrderProvider");
  return ctx;
} 