import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { ProductContextValue } from "@/api/types";
import type { GridApi } from "ag-grid-community";
import { useProductData } from "../product/getProducts";
import { useProductGrid } from "@/hooks/productManagement/useProductGrid";

export type ProductTab = "registration" | "bulk-registration";

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearchState] = useState("");
  const [activeProductTab, setActiveProductTabState] = useState<ProductTab>("registration");
  const [page, setPageState] = useState(1);
  const [gridApi, setGridApiState] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRowsState] = useState<any[]>([]);
  const [changedRows, setChangedRowsState] = useState<any[]>([]);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPageState(1);
  }, []);

  const setActiveProductTab = useCallback((tab: ProductTab) => {
    setActiveProductTabState(tab);
    setPageState(1);
  }, []);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
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

  const { productData, isLoading, error, refreshProducts } = useProductData({ search, skip: (page - 1) * 50 });
  const { gridRef, columnDefs, defaultColDef, gridOptions } = useProductGrid();

  const value: ProductContextValue = {
    search,
    setSearch,
    activeProductTab,
    setActiveProductTab,
    page,
    setPage,
    productData,
    isLoading,
    error,
    refreshProducts,
    gridRef,
    columnDefs,
    defaultColDef,
    gridOptions,
    gridApi,
    setGridApi,
    selectedRows,
    setSelectedRows,
    changedRows,
    setChangedRows,
    clearSelections,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export function useProductContext() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProductContext must be used within a ProductProvider");
  return ctx;
} 