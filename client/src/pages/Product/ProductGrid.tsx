import { useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { GridReadyEvent } from "ag-grid-community";
import { useProductContext } from "@/api/context/ProductContext";

export const ProductGrid = () => {
  const {
    productData,
    gridRef,
    columnDefs,
    defaultColDef,
    gridOptions,
    setGridApi,
    setSelectedRows,
    setChangedRows,
  } = useProductContext();

  const [changedRowsState, setChangedRowsState] = useState<Set<string>>(new Set());

  const onGridReady = useCallback((params: GridReadyEvent) => {
    if (setGridApi) {
      setGridApi(params.api);
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
    <div className="ag-theme-alpine w-full h-[calc(100vh-60px)]">
      <AgGridReact
        ref={gridRef}
        rowData={productData || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChangedCallback}
        onCellValueChanged={onCellValueChanged}
        onRowDataUpdated={clearChangedRows}
        {...gridOptions}
        getRowId={(params) => params.data.id?.toString()}
      />
    </div>
  );
};
