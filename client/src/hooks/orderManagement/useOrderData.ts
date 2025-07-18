import { useCallback, useMemo } from "react";
import { useOrderList } from "./useOrderList";

interface UseOrderDataParams {
  page: number;
}

export const useOrderData = ({ page }: UseOrderDataParams) => {
  const { data, isLoading, error, refetch } = useOrderList({ page });

  const orderData = useMemo(() => {
    return data?.items?.map((item: { item: any; }) => item.item).filter(Boolean) || [];
  }, [data?.items]);

  const refreshOrders = useCallback(() => {
    refetch();
  }, [refetch]);


console.log('useOrderData - API Response:', {
    rawData: data,
    extractedOrderData: orderData,
    itemsLength: data?.items?.length,
    orderDataLength: orderData.length
  });

  return {
    orderData,
    isLoading,
    error,
    refreshOrders,
  };
}; 