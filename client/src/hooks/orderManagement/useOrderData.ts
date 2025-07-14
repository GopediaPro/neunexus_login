import { useCallback } from "react";
import { useOrders } from "@/hooks/orderManagement/useOrders";

interface UseOrderDataParams {
  search: string;
  page: number;
  currentTemplate: string;
}

export const useOrderData = ({ search, page, currentTemplate }: UseOrderDataParams) => {
  const { data, isLoading, error, refetch } = useOrders({ templateCode: currentTemplate, search, page });

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