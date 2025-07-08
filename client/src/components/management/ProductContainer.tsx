import type { ProductData } from '@/shared/types/product.types';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef } from 'ag-grid-community';
import { useEffect, useRef, useState } from 'react';
import { HeaderManagement } from './HeaderManagement';
import { useSidebar } from '@/contexts/SidebarContext';
import { LeftSidebarLayout } from '../mainpage/layout/LeftSidebarLayout';
import { productDummyData } from '@/mocks/dummy/product';
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { ProductToolbar } from './ProductToolbar';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/getProducts';
import { useSearchParams } from 'react-router-dom';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const ProductContainer = () => {
  const [productData, _setProductData] = useState<ProductData[]>();
  const { isOpen, close } = useSidebar();
  const isInitialMount = useRef(true);
  const [searchParams] = useSearchParams();

  const gridRef = useRef<AgGridReact>(null);
  const page = parseInt(searchParams.get('page') || '1');

  const { data } = useQuery({
    queryKey: ['products', page],
    queryFn: () => getProducts(page)
  });
  console.log('data', data);

  useEffect(() => {
    if (isInitialMount) {
      close();
      isInitialMount.current = false;
    }
  }, []);
  useEffect(() => {
    if (data?.products) {
      _setProductData(data.products);
    }
  }, [data]);

  const columnDefs: ColDef<ProductData>[] = [
    {
      field: 'goods_nm',
      headerName: '상품명',
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'brand_nm',
      headerName: '브랜드',
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'goods_price',
      headerName: '판매가격',
      width: 120,
      valueFormatter: (params) => `${params.value?.toLocaleString()}원`,
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'goods_consumer_price',
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
      field: 'maker',
      headerName: '제조사',
      width: 160,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'origin',
      headerName: '원산지',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'char_1_nm',
      headerName: '키워드',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'char_1_nm',
      headerName: '옵션1',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'char_2_nm',
      headerName: '옵션2',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'created_at',
      headerName: '생성일시',
      width: 120,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '',
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    }
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true
  };

  return (
    <div className="min-h-screen">
      {isOpen ? (
        <div className="grid grid-cols-[183px_1fr] min-h-screen">
          <LeftSidebarLayout />
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
