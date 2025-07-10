import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { useSidebar } from "@/contexts/SidebarContext";
import { useEffect, useRef, useState } from "react";
import { MenuSidebarLayout } from '@/components/mainpage/layout/MenuSidebarLayout';
import { HeaderManagement } from '../HeaderManagement';
import { OrderGrid } from '../common/OrderGrid';
import { OrderToolbar } from '../OrderToolbar';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const OrderLayout = () => {
  const { isOpen, close } = useSidebar();
  const isInitialMount = useRef(true);
  const [currentTemplate, setCurrentTemplate] = useState<string>('');

  useEffect(() => {
    if (isInitialMount.current) {
      close();
      isInitialMount.current = false;
    }
  }, [close]);

  const handleTemplateChange = (templateCode: string) => {
    setCurrentTemplate(templateCode);
  }

  return (
    <div className="min-h-screen">
      {isOpen ? (
        <div className="grid grid-cols-[183px_1fr] min-h-screen">
          <MenuSidebarLayout />
          <div className="flex flex-col">
            <HeaderManagement title="상품/주문 관리 시스템" />
            <OrderToolbar onTemplateChange={handleTemplateChange} />
            <div className="flex-1 p-4">
              <OrderGrid templateCode={currentTemplate} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-fill-base-100">
          <HeaderManagement title="상품/주문 관리 시스템" />
          <OrderToolbar onTemplateChange={handleTemplateChange} />
          <div className="flex-1 p-4 pl-6">
            <OrderGrid templateCode={currentTemplate} />
          </div>
        </div>
      )}
    </div>
  );
};
