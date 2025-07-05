import { HeaderManagement } from "./HeaderManagement";
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { ProductToolbar } from "./ProductToolbar";
import { MenuSidebarLayout } from "../mainpage/layout/MenuSidebarLayout";
import { useProductManagement } from "@/hooks";
import { ProductGrid } from "./common/ProdcutGrid";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const ProductLayout = () => {
  const { isOpen } = useProductManagement();

  return (
    <div className="min-h-screen">
      {isOpen ? (
        <div className="grid grid-cols-[183px_1fr] min-h-screen">
          <MenuSidebarLayout />
          <div className="flex flex-col">
            <HeaderManagement title="상품 관리 시스템" />
            <ProductToolbar />
            <div className="flex-1 p-4">
              <ProductGrid />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-page-card-bg">
          <HeaderManagement title="상품/주문 관리 시스템" />
          <ProductToolbar />
          <div className="flex-1 p-4 pl-6">
            <ProductGrid />
          </div>
        </div>
      )}
    </div>
  );
};
