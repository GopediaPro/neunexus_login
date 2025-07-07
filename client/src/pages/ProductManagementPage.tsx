import { ProductLayout } from "@/components/management/layout/ProductLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const ProductManagementPage = () => {

  return (
    <SidebarProvider>
      <ProductLayout />
    </SidebarProvider>
  );
};