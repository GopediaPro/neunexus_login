import { useCallback } from "react";
import { useOrders } from "@/hooks/orderManagement/useOrders";

interface UseOrderDataParams {
  page: number;
  currentTemplate: string;
}

export const useOrderData = ({ page, currentTemplate }: UseOrderDataParams) => {
  const { data, isLoading, error, refetch } = useOrders({ templateCode: currentTemplate, page });

  const orderData = data?.items?.[0]?.data || [];

  const refreshOrders = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    orderData,
    isLoading,
    error,
    refreshOrders,
  };
}; 