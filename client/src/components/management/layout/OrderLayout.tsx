import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { useSidebar } from "@/contexts/SidebarContext";
import { useEffect, useRef } from "react";
import { MenuSidebarLayout } from '@/components/mainpage/layout/MenuSidebarLayout';
import { HeaderManagement } from '../HeaderManagement';
import { ProductToolbar } from '../ProductToolbar';
import { ProductGrid } from '../common/ProdcutGrid';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const OrderLayout = () => {
  const { isOpen, close } = useSidebar();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      close();
      isInitialMount.current = false;
    }
  }, [close]);

  return (
    <div className="min-h-screen">
      {isOpen ? (
        <div className="grid grid-cols-[183px_1fr] min-h-screen">
          <MenuSidebarLayout />
          <div className="flex flex-col">
            <HeaderManagement title="상품/주문 관리 시스템" />
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
