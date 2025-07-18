import { useCallback, useMemo, useRef, useState } from "react";
import type { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useOrderContext } from "@/contexts/OrderContext";

export const OrderGrid = () => {
  const {
    orderData,
    setGridApi,
    setSelectedRows,
    setChangedRows,
  } = useOrderContext();

  const gridRef = useRef<AgGridReact>(null);
  const [_internalGridApi, setInternalGridApi] = useState<GridApi | null>(null);
  const [changedRowsState, setChangedRowsState] = useState<Set<string>>(new Set());

  const createPriceColumn = (field: string, headerName: string, width: number) => ({
    field,
    headerName,
    width,
    valueFormatter: (params: any) => {
      const value = params.value;
      if (value === null || value === undefined || value === '') return '';
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
      return isNaN(numValue) ? '' : `${numValue.toLocaleString()}원`;
    },
    valueParser: (params: any) => {
      const value = params.newValue;
      if (value === null || value === undefined || value === '') return null;
      
      const cleanValue = String(value).replace(/[원,]/g, '').trim();
      const numValue = parseFloat(cleanValue);
      
      return isNaN(numValue) ? null : numValue;
    },
    valueSetter: (params: any) => {
      const value = params.newValue;
      let parsedValue = null;
      
      if (value !== null && value !== undefined && value !== '') {
        const cleanValue = String(value).replace(/[원,]/g, '').trim();
        const numValue = parseFloat(cleanValue);
        parsedValue = isNaN(numValue) ? null : numValue;
      }
      
      params.data[field] = parsedValue;
      return true;
    },
    filter: 'agNumberColumnFilter',
    floatingFilterComponentParams: {
      suppressFilterButton: true
    },
    editable: true,
    cellEditor: 'agTextCellEditor',
    cellEditorParams: {
      maxLength: 20
    }
  });

  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'checkbox',
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      width: 50,
      maxWidth: 50,
      cellClass: 'ag-cell-centered',
      suppressMovable: true,
      filter: false,
      editable: false
    },
    {
      field: 'order_id',
      headerName: '주문ID',
      width: 160,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'mall_order_id',
      headerName: '몰주문ID',
      width: 160,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'product_name',
      headerName: '상품명',
      width: 240,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      tooltipField: 'product_name',
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'receive_name',
      headerName: '받는분',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'receive_cel',
      headerName: '연락처',
      width: 160,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'sale_cnt',
      headerName: '수량',
      width: 160,
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      cellClass: 'ag-cell-centered',
      editable: true,
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: {
        min: 0,
        max: 9999
      }
    },
    createPriceColumn('pay_cost', '결제금액', 120),
    createPriceColumn('expected_payout', '예상정산금', 120),
    createPriceColumn('service_fee', '서비스수수료', 120),
    createPriceColumn('delv_cost', '배송비', 120),
    {
      field: 'fld_dsp',
      headerName: '판매처',
      width: 180,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'receive_addr',
      headerName: '배송주소',
      width: 250,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      tooltipField: 'receive_addr',
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'delv_msg',
      headerName: '배송메모',
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      tooltipField: 'delv_msg',
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'sku_value',
      headerName: 'SKU정보',
      width: 250,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      tooltipField: 'sku_value',
      editable: true,
      cellEditor: 'agTextCellEditor'
    },
    {
      field: 'process_dt',
      headerName: '처리일시',
      width: 150,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '',
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      editable: true,
      cellEditor: 'agDateCellEditor'
    },
    {
      field: 'created_at',
      headerName: '생성일시',
      width: 150,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '',
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      cellStyle: {
        borderRight: 'none'
      },
      headerCellStyle: {
        borderRight: 'none'
      }
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    minWidth: 120
  }), []);

  const gridOptions = useMemo(() => ({
    theme: "legacy" as const,
    pagination: false,
    paginationPageSize: 20,
    animateRows: true,
    headerHeight: 45,
    rowHeight: 40,
    rowSelection: "multiple" as const,
    domLayout: "normal" as const,
    suppressRowClickSelection: true,
    enterMovesDown: true,
    enterMovesDownAfterEdit: true,
    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    if (setGridApi) {
      setGridApi(params.api);
    } else {
      setInternalGridApi(params.api);
    }
  }, [setGridApi]);

  const onSelectionChangedCallback = useCallback((event: any) => {
    const selectedRows = event.api.getSelectedRows();
    
    if (setSelectedRows) {
      setSelectedRows(selectedRows);
    }
  }, [setSelectedRows]);

  const onCellValueChanged = useCallback((event: any) => {
    const rowId = event.data.id?.toString();
    if (rowId) {
      setChangedRowsState(prev => new Set(prev).add(rowId));
      
      if (setChangedRows) {
        let allChangedRowsData = Array.from(changedRowsState).map(id => {
          const rowNode = event.api.getRowNode(id);
          return rowNode?.data;
        }).filter(Boolean);

        if (!allChangedRowsData.find(row => row.id?.toString() === rowId)) {
          allChangedRowsData = [...allChangedRowsData, event.data];
        }
        
        setChangedRows(allChangedRowsData);
      }
    }
  }, [setChangedRows, changedRowsState]);

  const clearChangedRows = useCallback(() => {
    setChangedRowsState(new Set());
    if (setChangedRows) {
      setChangedRows([]);
    }
  }, [setChangedRows]);

  if (!orderData) {
    return (
      <div className="ag-theme-alpine w-full h-[calc(100vh-60px)] bg-fill-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-text-base-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-base-500 mb-2">주문 관리 시스템</h3>
          <p className="text-text-base-400 mb-1">템플릿을 선택하여 주문 데이터를 조회하세요</p>
          <p className="text-sm text-text-base-300">'주문 등록' 버튼을 클릭하여 시작하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ag-theme-alpine w-full h-[calc(100vh-60px)] bg-fill-base-100">
      <AgGridReact
        ref={gridRef}
        rowData={orderData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChangedCallback}
        onCellValueChanged={onCellValueChanged}
        onRowDataUpdated={clearChangedRows}
        {...gridOptions}
        getRowId={(params) => params.data.id.toString()}
      />
    </div>
  );
};
