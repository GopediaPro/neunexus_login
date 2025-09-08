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
    <main className="min-w-screen-xl min-h-screen">
      {isOpen ? (
        <section className="grid grid-cols-sidebar-layout 2xl:grid-cols-sidebar-layout-2xl min-h-screen">
          <nav>
            <MenuSidebarLayout />
          </nav>
          <section className="flex flex-col">
            <header>
              <HeaderManagement title="상품/주문 관리 시스템" />
            </header>
            <nav>
              <OrderToolbar />
            </nav>
            <section className="flex-1 p-4 px-6 bg-fill-base-100">
              <OrderGrid />
            </section>
          </section>
        </section>
      ) : (
        <section className="flex flex-col min-h-screen bg-fill-base-100">
          <header>
            <HeaderManagement title="상품/주문 관리 시스템" />
          </header>
          <nav>
            <OrderToolbar />
          </nav>
          <section className="flex-1 p-4 px-6">
            <OrderGrid />
          </section>
        </section>
      )}
    </main>
  );
};