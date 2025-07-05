import { ProductLayout } from "@/components/management/ProductLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const ProductManagementPage = () => {

  return (
    <SidebarProvider>
      <ProductLayout />
    </SidebarProvider>
  );
};