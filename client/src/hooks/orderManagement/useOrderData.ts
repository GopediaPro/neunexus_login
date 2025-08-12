import { useMemo } from "react";
import { useOrderList } from "@/api/order/getDownFormOrders";
import type { OrderItem } from "@/api/types";

export const useOrderData = () => {
  const { 
    data, 
    isLoading, 
    error,
  } = useOrderList();
  
  const orderData = useMemo(() => {
    if (!data?.items) return [];
    
    return data.items
      .map((item: { content: OrderItem; status: string; message: string | null }) => item.content)
      .filter(Boolean);
  }, [data]);

  return {
    orderData,
    isLoading,
    error
  };
};