import { getDownFormOrders } from "@/api/order/getDownFormOrders"
import { useQuery } from "@tanstack/react-query"

export const useOrders = ({ templateCode }: { templateCode: string }) => {
  return useQuery({
    queryKey: ['orders', templateCode],
    queryFn: () => getDownFormOrders({ template_code: templateCode }),
    enabled: !!templateCode && templateCode !== ''
  })
}