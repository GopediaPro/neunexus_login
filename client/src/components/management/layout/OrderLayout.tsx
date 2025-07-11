import { ModuleRegistry, ClientSideRowModelModule, type GridApi } from 'ag-grid-community';
import { useSidebar } from "@/contexts/SidebarContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { MenuSidebarLayout } from '@/components/mainpage/layout/MenuSidebarLayout';
import { HeaderManagement } from '../HeaderManagement';
import { OrderGrid } from '../common/OrderGrid';
import { OrderToolbar } from '../OrderToolbar';
import { useOrders } from '@/hooks/orderManagement/useOrders';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const OrderLayout = () => {
  const { isOpen, close } = useSidebar();
  const isInitialMount = useRef(true);
  const [currentTemplate, setCurrentTemplate] = useState<string>('');
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [changedRows, setChangedRows] = useState<any[]>([]);

  const { data: ordersData } = useOrders({ templateCode: currentTemplate });

  useEffect(() => {
    if (ordersData?.items && ordersData.items.length > 0) {
      if (ordersData.items[0]?.data) {
        const actualData = ordersData.items[0].data;
        setOriginalData(actualData || []);
      }
    } else {
      setOriginalData([]);
    }
  }, [ordersData]);

  useEffect(() => {
    if (isInitialMount.current) {
      close();
      isInitialMount.current = false;
    }
  }, [close]);

  const handleTemplateChange = (templateCode: string) => {
    setCurrentTemplate(templateCode);
    setOriginalData([]);
    setSelectedRows([]);
  }

  const handleSelectionChanged = useCallback((selectedRowsData: any[]) => {
    setSelectedRows(selectedRowsData);
  }, []);

  const handleDataChanged = useCallback((changedRowsData: any[]) => {
    setChangedRows(changedRowsData);
  }, []);

  return (
    <div className="min-h-screen">
      {isOpen ? (
        <div className="grid grid-cols-[183px_1fr] min-h-screen">
          <MenuSidebarLayout />
          <div className="flex flex-col">
            <HeaderManagement title="상품/주문 관리 시스템" />
            <OrderToolbar 
              onTemplateChange={handleTemplateChange} 
              gridApi={gridApi} 
              selectedRows={selectedRows}
              currentTemplate={currentTemplate}
              changedRows={changedRows}
            />
            <div className="flex-1 p-4">
              <OrderGrid
                rowData={originalData}
                gridApi={gridApi}
                setGridApi={setGridApi}
                onSelectionChanged={handleSelectionChanged}
                onDataChanged={handleDataChanged}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-fill-base-100">
          <HeaderManagement title="상품/주문 관리 시스템" />
            <OrderToolbar 
              onTemplateChange={handleTemplateChange} 
              gridApi={gridApi} 
              selectedRows={selectedRows}
              currentTemplate={currentTemplate}
              changedRows={changedRows}
            />
          <div className="flex-1 p-4 pl-6">
            <OrderGrid
              rowData={originalData}
              gridApi={gridApi}
              setGridApi={setGridApi} 
              onSelectionChanged={handleSelectionChanged}
              onDataChanged={handleDataChanged}
            />
          </div>
        </div>
      )}
    </div>
  );
};
