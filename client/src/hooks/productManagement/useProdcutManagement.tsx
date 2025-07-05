import { useEffect, useRef } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useProductData } from "./useProductData";
import { useProductGrid } from "./useProductGrid";

export const useProductManagement = () => {
  const { isOpen, close } = useSidebar();
  const isInitialMount = useRef(true);
  
  const productDataHook = useProductData();
  const productGridHook = useProductGrid();

  useEffect(() => {
    if (isInitialMount.current) {
      close();
      isInitialMount.current = false;
    }
  }, [close]);

  return {
    isOpen,
    
    ...productDataHook,
    ...productGridHook,
  };
};
