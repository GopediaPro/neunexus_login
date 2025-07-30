import { useCallback, useMemo, useRef, useState } from "react";
import type { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useOrderContext } from "@/contexts/OrderContext";

export const OrderGrid = () => {
  const {
    orderData,
    isLoading,
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

  const createDateColumn = (field: string, headerName: string, width: number = 150) => ({
    field,
    headerName,
    width,
    valueFormatter: (params: any) =>
      params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '',
    filter: 'agDateColumnFilter',
    floatingFilterComponentParams: {
      suppressFilterButton: true
    },
    editable: true,
    cellEditor: 'agDateCellEditor'
  });

  const createTextColumn = (field: string, headerName: string, width: number, options: {
    tooltip?: boolean;
    maxLength?: number;
  } = {}) => ({
    field,
    headerName,
    width,
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {
      suppressFilterButton: true
    },
    ...(options.tooltip && { tooltipField: field }),
    editable: true,
    cellEditor: 'agTextCellEditor',
    ...(options.maxLength && {
      cellEditorParams: {
        maxLength: options.maxLength
      }
    })
  });

  const createNumberColumn = (field: string, headerName: string, width: number, options: {
    min?: number;
    max?: number;
    centered?: boolean;
  } = {}) => ({
    field,
    headerName,
    width,
    filter: 'agNumberColumnFilter',
    floatingFilterComponentParams: {
      suppressFilterButton: true
    },
    ...(options.centered && { cellClass: 'ag-cell-centered' }),
    editable: true,
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: {
      ...(options.min !== undefined && { min: options.min }),
      ...(options.max !== undefined && { max: options.max })
    }
  });

  const columnDefs: ColDef[] = useMemo(() => [
    // 기본 정보
    createNumberColumn('id', 'ID', 80, { min: 0 }),
    createTextColumn('order_id', '주문ID', 160),
    createTextColumn('mall_order_id', '몰주문ID', 160),
    
    // 상품 정보
    createTextColumn('product_id', '상품ID', 120),
    createTextColumn('product_name', '상품명', 240, { tooltip: true }),
    createTextColumn('mall_product_id', '몰상품ID', 140),
    createTextColumn('item_name', '아이템명', 200, { tooltip: true }),
    createTextColumn('sku_value', 'SKU정보', 200, { tooltip: true }),
    createTextColumn('sku_alias', 'SKU별칭', 120),
    createTextColumn('sku_no', 'SKU번호', 120),
    createTextColumn('barcode', '바코드', 140),
    createTextColumn('model_name', '모델명', 150),
    createTextColumn('erp_model_name', 'ERP모델명', 150),
    createTextColumn('location_nm', '위치명', 120),
    
    // 수량 및 금액
    createNumberColumn('sale_cnt', '수량', 100, { min: 0, max: 9999, centered: true }),
    createPriceColumn('pay_cost', '결제금액', 120),
    createPriceColumn('delv_cost', '배송비', 120),
    createPriceColumn('total_cost', '총금액', 120),
    createPriceColumn('total_delv_cost', '총배송비', 120),
    createPriceColumn('expected_payout', '예상정산금', 120),
    createPriceColumn('etc_cost', '기타비용', 120),
    createPriceColumn('service_fee', '서비스수수료', 120),
    
    // 합계 필드들
    createTextColumn('sum_p_ea', '합계수량', 100),
    createPriceColumn('sum_expected_payout', '합계예상정산금', 140),
    createPriceColumn('sum_pay_cost', '합계결제금액', 130),
    createPriceColumn('sum_delv_cost', '합계배송비', 120),
    createPriceColumn('sum_total_cost', '합계총금액', 120),
    
    // 배송 정보
    createTextColumn('receive_name', '받는분', 120),
    createTextColumn('receive_cel', '연락처', 160),
    createTextColumn('receive_tel', '전화번호', 160),
    createTextColumn('receive_addr', '배송주소', 300, { tooltip: true }),
    createTextColumn('receive_zipcode', '우편번호', 100),
    createTextColumn('delivery_payment_type', '배송결제유형', 140),
    createTextColumn('delv_msg', '배송메모', 200, { tooltip: true }),
    createTextColumn('delivery_id', '배송업체ID', 120),
    createTextColumn('delivery_class', '배송등급', 120),
    createTextColumn('invoice_no', '송장번호', 150),
    
    // 판매처 및 기타 정보
    createTextColumn('fld_dsp', '판매처', 180),
    createTextColumn('order_etc_6', '주문기타6', 120),
    createTextColumn('order_etc_7', '주문기타7', 120),
    createTextColumn('etc_msg', '기타메시지', 200, { tooltip: true }),
    createTextColumn('free_gift', '사은품', 120),
    createTextColumn('price_formula', '가격공식', 150),
    
    // 상태 및 처리 정보
    createTextColumn('form_name', '폼명', 120),
    createNumberColumn('seq', '순번', 80, { min: 0 }),
    createTextColumn('idx', '인덱스', 100),
    createTextColumn('work_status', '작업상태', 120),
    
    // 날짜 정보
    createDateColumn('process_dt', '처리일시'),
    createDateColumn('order_date', '주문일자'),
    createTextColumn('reg_date', '등록일', 120),
    createTextColumn('ord_confirm_date', '주문확인일', 130),
    createTextColumn('rtn_dt', '반품일', 120),
    createTextColumn('chng_dt', '변경일', 120),
    createTextColumn('delivery_confirm_date', '배송확인일', 130),
    createTextColumn('cancel_dt', '취소일', 120),
    createTextColumn('hope_delv_date', '희망배송일', 130),
    createTextColumn('inv_send_dm', '송장발송일', 130),
    createDateColumn('created_at', '생성일시'),
    {
      ...createDateColumn('updated_at', '수정일시'),
      headerClass: 'border-r-0'
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
    rowSelection: {
      mode: "multiRow" as const,
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: true,
      selectAll: "filtered" as const
    },
    domLayout: "normal" as const,
    enterNavigatesVertically: true,
    enterNavigatesVerticallyAfterEdit: true,
    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,

    scrollbarWidth: 16,
    suppressScrollOnNewData: false,
    suppressRowVirtualisation: false,

    getRowId: (params: any) => params.data.id?.toString(),
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

  return (
    <div className="ag-theme-alpine w-full h-[calc(100vh-60px)] bg-fill-base-100">
      <AgGridReact
        ref={gridRef}
        rowData={orderData}
        loading={isLoading}
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
