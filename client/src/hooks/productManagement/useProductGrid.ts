import { useCallback, useMemo, useRef } from "react";
import { type ColDef } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import type { ProductData } from "@/api/types/product.types";

export const useProductGrid = () => {
  const gridRef = useRef<AgGridReact<ProductData>>(null);

  const getStatusCellStyle = useCallback((params: any) => {
    const status = params.value;
    switch (status) {
      case 1:
      case '판매중':
        return { 
          backgroundColor: '#F4FFF4',
          color: '#2F8230',
          fontWeight: '500'
        };
      case 0:
      case '품절':
        return { 
          backgroundColor: '#fef2f2',
          color: '#F04848',
          fontWeight: '500'
        };
      case 2:
      case '단종':
        return { 
          backgroundColor: '#f9fafb',
          color: '#6b7280',         
          fontWeight: '500'
        };
      default:
        return null;
    }
  }, []);

  const columnDefs: ColDef<ProductData>[] = useMemo(() => [
    {
      field: 'goods_nm',
      headerName: '상품명',
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'brand_nm',
      headerName: '브랜드',
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'goods_price',
      headerName: '판매가격',
      width: 120,
      valueFormatter: (params) => params.value ? `${params.value?.toLocaleString()}원` : '',
      valueParser: (params) => {
        const value = params.newValue;
        if (value === null || value === undefined || value === '') return 0;
        const cleanValue = String(value).replace(/[원,]/g, '').trim();
        const numValue = parseFloat(cleanValue);
        return isNaN(numValue) ? 0 : numValue;
      },
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'goods_consumer_price',
      headerName: '소비자가격',
      width: 120,
      valueFormatter: (params) => params.value ? `${params.value?.toLocaleString()}원` : '',
      valueParser: (params) => {
        const value = params.newValue;
        if (value === null || value === undefined || value === '') return 0;
        const cleanValue = String(value).replace(/[원,]/g, '').trim();
        const numValue = parseFloat(cleanValue);
        return isNaN(numValue) ? 0 : numValue;
      },
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'status',
      headerName: '상태',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['판매중', '품절', '단종']
      },
      cellStyle: getStatusCellStyle,
      cellClass: 'ag-cell-centered',
      valueFormatter: (params) => {
        const statusMap: { [key: number]: string } = {
          0: '비활성',
          1: '활성',
          2: '대기',
        };
        return statusMap[params.value] || '알 수 없음';
      },
    },
    {
      field: 'maker',
      headerName: '제조사',
      width: 160,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'origin',
      headerName: '원산지',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'good_keyword',
      headerName: '키워드',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'char_1_nm',
      headerName: '옵션1',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'char_2_nm',
      headerName: '옵션2',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
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
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: false,
    minWidth: 80,
    suppressHeaderMenuButton: false
  }), []);

  const gridOptions = useMemo(() => ({
    theme: "legacy" as const,
    pagination: false,
    paginationPageSize: 20,
    animateRows: true,
    headerHeight: 45,
    rowHeight: 40,
    rowSelection: {
      mode: "multiRow" as const,
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: true,
      selectAll: "filtered" as const
    },
    domLayout: "normal" as const,
    suppressRowClickSelection: false,
    enterNavigatesVertically: true,
    enterNavigatesVerticallyAfterEdit: true,
    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
  }), []);

  return {
    gridRef,
    columnDefs,
    defaultColDef,
    gridOptions,
  };
}