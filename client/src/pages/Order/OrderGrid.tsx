import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { CellValueChangedEvent, GridReadyEvent, SelectionChangedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useOptimizedOrderData, useOrderActions, useRenderTracker } from "@/api/context/OrderContext";
import { OPTIMIZED_GRID_OPTIONS } from "@/constants/order";
import { createDefaultColDef, createGridOptions, createOrderColumns } from "@/utils/columnHelpers";

const CellRenderer = React.memo(({ value }: { value: any }) => (
  <span>{value}</span>
));
CellRenderer.displayName = 'CellRenderer';

const PriceCellRenderer = React.memo(({ value }: { value: number | null }) => {
  const formattedValue = useMemo(() => {
    if (value === null || value === undefined) return '';
    const numValue = Number(value);
    return isNaN(numValue) ? '' : `${numValue.toLocaleString()}원`;
  }, [value]);

  return <span>{formattedValue}</span>;
});
PriceCellRenderer.displayName = 'PriceCellRenderer';

export const OrderGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const changedRowsRef = useRef<Set<string>>(new Set());

  const orderData = useOptimizedOrderData();
  const { setGridApi, setSelectedRows, setChangedRows } = useOrderActions();
  
  useRenderTracker();

  const columnDefs = useMemo(() => {
    const baseColumns = createOrderColumns();
    
    return baseColumns.map((col: any) => {
      if (col.field?.includes('cost') || col.field?.includes('fee') || col.field?.includes('payout')) {
        return {
          ...col,
          cellRenderer: PriceCellRenderer,
        };
      }
      return col;
    });
  }, []);

  const defaultColDef = useMemo(() => createDefaultColDef(), []);
  const gridOptions = useMemo(() => ({
    ...createGridOptions(),
    ...OPTIMIZED_GRID_OPTIONS,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const { api } = params;
    
    if (setGridApi) {
      setGridApi(api);
    }

    api.sizeColumnsToFit();
    
  }, [setGridApi]);

  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    
    if (setSelectedRows) {
      setSelectedRows(selectedRows);
    }
  }, [setSelectedRows]);

  const debouncedCellValueChanged = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (event: CellValueChangedEvent) => {
      const { data, api } = event;
      const rowId = data.id?.toString();
      
      if (rowId) {
        changedRowsRef.current.add(rowId);
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (setChangedRows) {
            const allChangedRowsData = Array.from(changedRowsRef.current)
              .map(id => {
                const rowNode = api.getRowNode(id);
                return rowNode?.data;
              })
              .filter(Boolean);
            
            setChangedRows(allChangedRowsData);
          }
        }, 500);
      }
    };
  }, [setChangedRows]);

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    debouncedCellValueChanged(event);
  }, [debouncedCellValueChanged]);

  const onRowDataUpdated = useCallback(() => {
    changedRowsRef.current.clear();
    if (setChangedRows) {
      setChangedRows([]);
    }
  }, [setChangedRows]);

  useEffect(() => {
    return () => {
      changedRowsRef.current.clear();
    };
  }, []);

  const gridContainerStyle = useMemo(() => ({
    width: '100%',
    height: 'calc(100vh - 60px)',
    transform: 'translateZ(0)',
    willChange: 'auto',
  }), []);

  return (
    <div className="ag-theme-alpine bg-fill-base-100" style={gridContainerStyle}>
      <AgGridReact
        ref={gridRef}
        // 데이터 props
        rowData={orderData}
        
        // 컬럼 설정
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        
        // 이벤트 핸들러
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        onCellValueChanged={onCellValueChanged}
        onRowDataUpdated={onRowDataUpdated}
        
        // 최적화된 그리드 옵션
        {...gridOptions}
        
        // 성능 최적화 props
        enableCellTextSelection={false} // 텍스트 선택 비활성화로 성능 향상
        suppressMovableColumns={true} // 컬럼 이동 비활성화로 성능 향상
        
        // 로딩 상태 최적화
        overlayLoadingTemplate='<div class="ag-overlay-loading-center"><div class="ag-loading-spinner"></div><span>주문 데이터 로딩 중...</span></div>'
        overlayNoRowsTemplate='<div class="ag-overlay-no-rows-center">주문 데이터가 없습니다.</div>'
      />
    </div>
  );
};