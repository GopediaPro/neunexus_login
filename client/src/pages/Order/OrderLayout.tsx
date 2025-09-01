import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { useSidebar } from "@/contexts/SidebarContext";
import { useEffect, useRef } from "react";
import { MenuSidebarLayout } from '@/components/mainpage/layout/MenuSidebarLayout';
import { HeaderManagement } from '@/components/management/HeaderManagement';
import { OrderToolbar } from './OrderToolbar';
import { OrderGrid } from './OrderGrid';

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
    <>
      <div className="min-w-screen-xl min-h-screen">
        {isOpen ? (
          <div className="grid grid-cols-sidebar-layout 2xl:grid-cols-sidebar-layout-2xl min-h-screen">
            <MenuSidebarLayout />
            <div className="flex flex-col">
              <HeaderManagement title="상품/주문 관리 시스템" />
              <OrderToolbar />
              <div className="flex-1 p-4 px-6 bg-fill-base-100">
                <OrderGrid />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-screen bg-fill-base-100">
            <HeaderManagement title="상품/주문 관리 시스템" />
            <OrderToolbar />
            <div className="flex-1 p-4 px-6">
              <OrderGrid />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
