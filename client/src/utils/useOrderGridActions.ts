import { useCallback } from "react";
import type { GridApi } from "ag-grid-community";
import type { OrderData } from "@/shared/types";

export const useOrderGridActions = (gridApi: GridApi | null) => {

  const addNewRow = useCallback(async () => {
    if (!gridApi) return;
    
    try {
      const newRow: OrderData = {
        id: Date.now(),
        order_id: '',
        mall_order_id: '',
        product_name: '',
        receive_name: '',
        receive_cel: '',
        sale_cnt: 1,
        pay_cost: 0,
        expected_payout: 0,
        service_fee: 0,
        delv_cost: 0,
        fld_dsp: '',
        receive_addr: '',
        delv_msg: '',
        sku_value: '',
        process_dt: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      const result = gridApi.applyTransaction({
        add: [newRow],
        addIndex: 0
      });

      if (result && result.add && result.add.length > 0) {
        setTimeout(() => {
          const rowNode = gridApi.getRowNode(newRow.id.toString());
          if (rowNode) {
            gridApi.ensureIndexVisible(rowNode.rowIndex!, 'top');
            gridApi.startEditingCell({
              rowIndex: rowNode.rowIndex!,
              colKey: 'order_id'
            });
          }
        }, 100);
        
        return newRow;
      }
    } catch (error) {
      console.error('행 추가 중 오류 발생:', error);
    }
  }, [gridApi]);
    
  const deleteSelectedRows = useCallback(async () => {
    if (!gridApi) {
      return;
    }
    
    const selectedRows = gridApi.getSelectedRows();
    
    if (selectedRows.length === 0) return;

    
    const confirmMessage = selectedRows.length === 1 
      ? `선택된 주문 "${selectedRows[0].order_id || '신규 주문'}"을 삭제하시겠습니까?`
      : `선택된 ${selectedRows.length}개 주문을 삭제하시겠습니까?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    try {
      const result = gridApi.applyTransaction({
        remove: selectedRows
      });
      
      if (result && result.remove && result.remove.length > 0) {
        
        gridApi.deselectAll();
        
        return result.remove;
      }
    } catch (error) {
      console.error('행 삭제 중 오류 발생:', error);
    }
  }, [gridApi]);

  const getSelectedRows = useCallback((): OrderData[] => {
    if (!gridApi) return [];
    return gridApi.getSelectedRows();
  }, [gridApi]);

  const selectAllRows = useCallback(() => {
    if (!gridApi) return;
    gridApi.selectAll();
  }, [gridApi]);

  const deselectAllRows = useCallback(() => {
    if (!gridApi) return;
    gridApi.deselectAll();
  }, [gridApi]);

  const toggleRowSelection = useCallback((rowId: string) => {
    if (!gridApi) return;
    
    const rowNode = gridApi.getRowNode(rowId);
    if (rowNode) {
      rowNode.setSelected(!rowNode.isSelected());
    }
  }, [gridApi]);

  return {
    addNewRow,
    deleteSelectedRows,
    getSelectedRows,
    selectAllRows,
    deselectAllRows,
    toggleRowSelection
  };
};