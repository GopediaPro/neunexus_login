import { OrderLayout } from "@/pages/Order/OrderLayout";
import { OrderProvider } from "@/api/context/OrderContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const OrderManagementPage = () => {
  return (
    <OrderProvider>
      <SidebarProvider>
        <OrderLayout />
      </SidebarProvider>
    </OrderProvider>
  );
};