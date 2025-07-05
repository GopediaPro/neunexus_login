import { useRef } from "react";
import { type ColDef } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import type { ProductData } from "@/shared/types/product.types";

export const useProductGrid = () => {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs: ColDef<ProductData>[] = [
    { 
      field: 'productName', 
      headerName: '상품명', 
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'brand', 
      headerName: '브랜드', 
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'sellPrice', 
      headerName: '판매가격', 
      width: 120, 
      valueFormatter: (params) => `${params.value?.toLocaleString()}원`,
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'costPrice', 
      headerName: '소비자가격', 
      width: 120, 
      valueFormatter: (params) => `${params.value?.toLocaleString()}원`,
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'status', 
      headerName: '상태', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'manufacturer', 
      headerName: '제조사', 
      width: 160,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'creator', 
      headerName: '원산지', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'category', 
      headerName: '키워드', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'option1', 
      headerName: '옵션1', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'option2', 
      headerName: '옵션2', 
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
    { 
      field: 'createdDate', 
      headerName: '생성일시', 
      width: 120, 
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '',
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true }
    },
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
  };

  const gridOptions = {
    theme: "legacy" as const,
    pagination: true,
    paginationPageSize: 20,
    animateRows: true,
    headerHeight: 45,
    rowHeight: 40,
    rowSelection: "multiple" as const,
    domLayout: "normal" as const,
  };

  return {
    gridRef,
    columnDefs,
    defaultColDef,
    gridOptions,
  };
}