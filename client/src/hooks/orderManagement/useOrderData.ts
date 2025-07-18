import { useCallback, useMemo } from "react";
import { useOrderList } from "./useOrderList";

interface UseOrderDataParams {
  page: number;
}

export const useOrderData = ({ page }: UseOrderDataParams) => {
  const { data, isLoading, error, refetch } = useOrderList({ page });

  const orderData = useMemo(() => {
    if (!data?.items) return [];
    return data?.items?.map((item: { item: any; }) => item.item).filter(Boolean);
  }, [data]);

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