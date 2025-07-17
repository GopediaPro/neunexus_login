import { getDownFormOrders } from "@/api/order/getDownFormOrders";
import { useQuery } from "@tanstack/react-query";

export const useOrderList = ({ templateCode, search = '', page = 1 }: { templateCode: string; search?: string; page?: number }) => {
  return useQuery({
    queryKey: ['orders', templateCode, search, page],
    queryFn: () => getDownFormOrders({ template_code: templateCode, search, page }),
    enabled: !!templateCode && templateCode !== ''
  });
}; 