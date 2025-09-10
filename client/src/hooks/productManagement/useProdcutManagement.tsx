import { useState, useCallback } from "react";
import { useProductData } from "@/api/product/getProducts";
import { useProductGrid } from "./useProductGrid";
import type { ProductTab } from "@/api/context/ProductContext";

export const useProductManagement = () => {
  const [search, setSearch] = useState("");
  const [activeProductTab, setActiveProductTab] = useState<ProductTab>("registration");
  const [page, setPage] = useState(1);

  const productDataHook = useProductData({ search, skip: (page - 1) * 50 });
  const productGridHook = useProductGrid();

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleTabChange = useCallback((tab: ProductTab) => {
    setActiveProductTab(tab);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    ...productDataHook,
    ...productGridHook,
    search,
    setSearch: handleSearchChange,
    activeProductTab,
    setActiveProductTab: handleTabChange,
    page,
    setPage: handlePageChange,
  };
};
