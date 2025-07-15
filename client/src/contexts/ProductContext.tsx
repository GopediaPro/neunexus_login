import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useProductData } from "@/hooks/productManagement/useProductData";
import { useProductGrid } from "@/hooks/productManagement/useProductGrid";
import type { ProductContextValue } from "@/shared/types";

export type ProductTab = "registration" | "bulk-registration";

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearchState] = useState("");
  const [activeProductTab, setActiveProductTabState] = useState<ProductTab>("registration");
  const [page, setPageState] = useState(1);

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

  const { productData, isLoading, error, refreshProducts } = useProductData({ search, page });
  const { gridRef, columnDefs, defaultColDef, gridOptions, onGridReady } = useProductGrid();

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
    onGridReady,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export function useProductContext() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProductContext must be used within a ProductProvider");
  return ctx;
} 