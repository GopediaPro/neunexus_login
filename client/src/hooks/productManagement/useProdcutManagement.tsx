import { useProductData } from "./useProductData";
import { useProductGrid } from "./useProductGrid";

export const useProductManagement = () => {
  const productDataHook = useProductData();
  const productGridHook = useProductGrid();

  return {
    ...productDataHook,
    ...productGridHook,
  };
};
