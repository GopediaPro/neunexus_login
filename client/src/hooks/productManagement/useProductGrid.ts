import { useRef } from "react";
import { type ColDef } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import type { ProductData } from "@/shared/types/product.types";

export const useProductGrid = () => {
  const gridRef = useRef<AgGridReact>(null);

  const getStatusCellStyle = (params: any) => {
    const status = params.value;
    switch (status) {
      case '판매중':
        return { 
          backgroundColor: '#F4FFF4',
          color: '#2F8230',
          fontWeight: '500'
        };
      case '품절':
        return { 
          backgroundColor: '#fef2f2',
          color: '#F04848',
          fontWeight: '500'
        };
      case '단종':
        return { 
          backgroundColor: '#f9fafb',
          color: '#6b7280',         
          fontWeight: '500'
        };
      default:
        return null;
    }
  };

  const columnDefs: ColDef<ProductData>[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: 'left',
      resizable: false,
      sortable: false,
      filter: false,
      floatingFilter: false,
    },
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
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['판매중', '품절', '단종']
      },
      cellStyle: getStatusCellStyle,
      cellClass: 'ag-cell-centered'
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
    suppressRowClickSelection: true
  };

  return {
    gridRef,
    columnDefs,
    defaultColDef,
    gridOptions,
  };
}