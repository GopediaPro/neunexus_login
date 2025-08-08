import { OrderLayout } from "@/components/management/layout/OrderLayout";
import { OrderProvider } from "@/components/management/context/OrderContext";
import { SidebarProvider } from "@/components/mainpage/context/SidebarContext";

export const OrderManagementPage = () => {
  return (
    <OrderProvider>
      <SidebarProvider>
        <OrderLayout />
      </SidebarProvider>
    </OrderProvider>
  );
};