import type { ProductData } from "@/shared/types/product.types";
import { AgGridReact } from "ag-grid-react";
import { type ColDef } from 'ag-grid-community';
import { useEffect, useRef, useState } from "react";
import { HeaderManagement } from "./HeaderManagement";
import { useSidebar } from "@/contexts/SidebarContext";
import { productDummyData } from "@/mocks/dummy/product";
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { ProductToolbar } from "./ProductToolbar";
import { MenuSidebarLayout } from "../mainpage/layout/MenuSidebarLayout";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const ProductLayout = () => {
  const [productData, _setProductData] = useState<ProductData[]>(productDummyData);
  const { isOpen, close } = useSidebar();
  const isInitialMount = useRef(true);

  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    if (isInitialMount) {
      close();
      isInitialMount.current = false;
    }
  }, []);

  const columnDefs: ColDef<ProductData>[] = [
    { 
      field: 'productName', 
      headerName: '상품명', 
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'brand', 
      headerName: '브랜드', 
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'sellPrice', 
      headerName: '판매가격', 
      width: 120, 
      valueFormatter: (params) => `${params.value?.toLocaleString()}원`,
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'costPrice', 
      headerName: '소비자가격', 
      width: 120, 
      valueFormatter: (params) => `${params.value?.toLocaleString()}원`,
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'status', 
      headerName: '상태', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'manufacturer', 
      headerName: '제조사', 
      width: 160,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'creator', 
      headerName: '원산지', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'category', 
      headerName: '키워드', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'option1', 
      headerName: '옵션1', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'option2', 
      headerName: '옵션2', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    { 
      field: 'createdDate', 
      headerName: '생성일시', 
      width: 120, 
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '',
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
  };

  return (
    <div className="min-h-screen">
      {isOpen ? (
        <div className="grid grid-cols-[183px_1fr] min-h-screen">
          <MenuSidebarLayout />
          <div className="flex flex-col">
            <HeaderManagement title="상품 관리 시스템" />
            <ProductToolbar />
            <div className="flex-1 p-4">
              <div className="ag-theme-alpine w-full h-[calc(100vh-60px)]">
                <AgGridReact
                  theme="legacy"
                  ref={gridRef}
                  rowData={productData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={20}
                  animateRows={true}
                  headerHeight={45}
                  rowHeight={40}
                  rowSelection="multiple"
                  domLayout="normal"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-page-card-bg">
          <HeaderManagement title="상품 관리 시스템" />
          <ProductToolbar />
          <div className="flex-1 p-4 pl-6">
            <div className="ag-theme-alpine w-full h-[calc(100vh-60px)]">
              <AgGridReact
                theme="legacy"
                ref={gridRef}
                rowData={productData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={20}
                animateRows={true}
                headerHeight={45}
                rowHeight={40}
                rowSelection="multiple"
                domLayout="normal"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
