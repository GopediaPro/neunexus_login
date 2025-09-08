import { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useOrderData } from "@/hooks/orderManagement/useOrderData";
import type { DataFilterTab, FormTemplate, OrderContextValue, OrderItem } from "@/api/types";
import type { GridApi } from "ag-grid-community";

interface OrderStateContext {
  activeOrderTab: DataFilterTab;
  currentTemplate: FormTemplate;
  orderData: OrderItem[];
  isLoading: boolean;
  error: Error | null;
}

interface OrderGridContext {
  gridApi: GridApi | null;
  selectedRows: OrderItem[];
  changedRows: OrderItem[];
}

interface OrderActionsContext {
  setActiveOrderTab: (tab: DataFilterTab) => void;
  setCurrentTemplate: (template: FormTemplate) => void;
  setGridApi: (api: GridApi | null) => void;
  setSelectedRows: (rows: OrderItem[]) => void;
  setChangedRows: (rows: OrderItem[]) => void;
  clearSelections: () => void;
}

interface OrderComputedContext {
  hasSelectedRows: boolean;
  hasChangedRows: boolean;
  selectedRowCount: number;
  changedRowCount: number;
  isGridReady: boolean;
  hasData: boolean;
}

const OrderState = createContext<OrderStateContext | undefined>(undefined);
const OrderGrid = createContext<OrderGridContext | undefined>(undefined);
const OrderActions = createContext<OrderActionsContext | undefined>(undefined);
const OrderComputed = createContext<OrderComputedContext | undefined>(undefined);

const filterValidRows = (rows: OrderItem[]): OrderItem[] => {
  return rows.filter(row => {
    if (row.id && String(row.id).startsWith('temp_')) {
      return false;
    }
    
    const rowWithStatus = row as OrderItem & { status?: string; isTemp?: boolean };
    if (!row.order_id || rowWithStatus.status === 'pending' || rowWithStatus.isTemp) {
      return false;
    }
    
    return true;
  });
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [activeOrderTab, setActiveOrderTabState] = useState<DataFilterTab>("all");
  const [currentTemplate, setCurrentTemplateState] = useState<FormTemplate>("gmarket_erp");
  const [gridApi, setGridApiState] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRowsState] = useState<OrderItem[]>([]);
  const [changedRows, setChangedRowsState] = useState<OrderItem[]>([]);
  
  const filterValidRowsRef = useRef(filterValidRows);
  
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
    const filteredRows = filterValidRowsRef.current(rows);
    setSelectedRowsState(filteredRows);
  }, []);

  const setChangedRows = useCallback((rows: OrderItem[]) => {
    const filteredRows = filterValidRowsRef.current(rows);
    setChangedRowsState(filteredRows);
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedRowsState([]);
    setChangedRowsState([]);
    if (gridApi) {
      gridApi.deselectAll();
    }
  }, [gridApi]);

  const stateValue = useMemo(() => ({
    activeOrderTab,
    currentTemplate,
    orderData,
    isLoading: dataIsLoading,
    error,
  }), [activeOrderTab, currentTemplate, orderData, dataIsLoading, error]);

  const gridValue = useMemo(() => ({
    gridApi,
    selectedRows,
    changedRows,
  }), [gridApi, selectedRows, changedRows]);

  const actionsValue = useMemo(() => ({
    setActiveOrderTab,
    setCurrentTemplate,
    setGridApi,
    setSelectedRows,
    setChangedRows,
    clearSelections,
  }), [setActiveOrderTab, setCurrentTemplate, setGridApi, setSelectedRows, setChangedRows, clearSelections]);

  const computedValue = useMemo(() => ({
    hasSelectedRows: selectedRows.length > 0,
    hasChangedRows: changedRows.length > 0,
    selectedRowCount: selectedRows.length,
    changedRowCount: changedRows.length,
    isGridReady: !!gridApi,
    hasData: orderData.length > 0,
  }), [selectedRows.length, changedRows.length, gridApi, orderData.length]);

  return (
    <OrderState.Provider value={stateValue}>
      <OrderGrid.Provider value={gridValue}>
        <OrderActions.Provider value={actionsValue}>
          <OrderComputed.Provider value={computedValue}>
            {children}
          </OrderComputed.Provider>
        </OrderActions.Provider>
      </OrderGrid.Provider>
    </OrderState.Provider>
  );
};

export const useOrderState = () => {
  const context = useContext(OrderState);
  if (!context) throw new Error("useOrderState must be used within OrderProvider");
  return context;
};

export const useOrderGrid = () => {
  const context = useContext(OrderGrid);
  if (!context) throw new Error("useOrderGrid must be used within OrderProvider");
  return context;
};

export const useOrderActions = () => {
  const context = useContext(OrderActions);
  if (!context) throw new Error("useOrderActions must be used within OrderProvider");
  return context;
};

export const useOrderComputed = () => {
  const context = useContext(OrderComputed);
  if (!context) throw new Error("useOrderComputed must be used within OrderProvider");
  return context;
};

export const useOrderContext = (): OrderContextValue => {
  const state = useOrderState();
  const grid = useOrderGrid();
  const actions = useOrderActions();
  const computed = useOrderComputed();

  return useMemo(() => ({
    ...state,
    ...grid,
    ...actions,
    ...computed,
  }), [state, grid, actions, computed]);
};

export const useRenderTracker = () => {
  const renderCount = useRef(0);
  const lastRender = useRef(Date.now());
  
  renderCount.current += 1;
  const now = Date.now();
  const timeSinceLastRender = now - lastRender.current;
  lastRender.current = now;

  return { renderCount: renderCount.current, timeSinceLastRender };
};

export const useOptimizedOrderData = () => {
  const { orderData, activeOrderTab } = useOrderState();
  
  const filteredData = useMemo(() => {
    if (!orderData || orderData.length === 0) return [];
    
    switch (activeOrderTab) {
      case 'style':
        return orderData.filter(order => order.sku_value || order.model_name);
      case 'collection':
        return orderData.filter(order => order.product_name || order.item_name);
      default:
        return orderData;
    }
  }, [orderData, activeOrderTab]);

  return filteredData;
};