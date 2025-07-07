import { OrderLayout } from "@/components/management/layout/OrderLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const OrderManagementPage = () => {
  return (
    <SidebarProvider>
      <OrderLayout />
    </SidebarProvider>
  );
};