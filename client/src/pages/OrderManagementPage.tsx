import { OrderLayout } from "@/components/management/layout/OrderLayout";
import { OrderProvider } from "@/contexts/OrderContext";
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