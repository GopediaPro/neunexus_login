import { ProductLayout } from "@/components/management/layout/ProductLayout";
import { SidebarProvider } from "@/components/mainpage/context/SidebarContext";

export const ProductManagementPage = () => {

  return (
    <SidebarProvider>
      <ProductLayout />
    </SidebarProvider>
  );
};