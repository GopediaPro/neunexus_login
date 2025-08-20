import { ProductProvider } from "@/api/context/ProductContext";
import { ProductLayout } from "@/pages/Product/ProductLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const ProductManagementPage = () => {

  return (
    <ProductProvider>
      <SidebarProvider>
        <ProductLayout />
      </SidebarProvider>
    </ProductProvider>
  );
};