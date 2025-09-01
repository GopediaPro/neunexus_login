import { useQuery } from "@tanstack/react-query";
import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";

export const getDownFormOrders = async ({
  limit = 30,
}: {
  limit?: number;
}) => {
  const params: Record<string, any> = {
    limit
  };

  try {
    const response = await httpClient.get(API_END_POINT.DOWN_FORM_ORDERS, { 
      params, 
      timeout: 100000 
    });
    
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map((item: any) => ({
        ...item,
        expected_payout: isNaN(Number(item.expected_payout)) ? 0 : Number(item.expected_payout)
      }));
    }
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const useOrderList = () => {
  return useQuery({
    queryKey: ['downFormOrders'],
    queryFn: () => getDownFormOrders({ limit: 30 }),
    retry: (failureCount, error: any) => {
      if (error?.response?.data?.error?.includes('finite_number')) {
        return false;
      }
      return failureCount < 3;
    }
  });
};