import { ProductContainer } from "@/components/management/ProductContainer";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const ProductManagement = () => {

  return (
    <SidebarProvider>
      <ProductContainer />
    </SidebarProvider>
  );
};