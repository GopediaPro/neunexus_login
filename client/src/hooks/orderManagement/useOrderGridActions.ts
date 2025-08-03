import { useCallback } from "react";
import type { GridApi } from "ag-grid-community";
import type { OrderItem } from "@/shared/types";
import { useOrderContext } from "@/contexts/OrderContext";
import { postBulkDownFormOrders } from "@/api/order/postBulkDownFormOrders";

export const useOrderGridActions = (gridApi: GridApi | null) => {
  const {
    currentTemplate,
    setSelectedRows,
    setChangedRows,
    selectedRows,
    changedRows
  } = useOrderContext();

  const createEmptyRow = useCallback((): OrderItem => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      id: 0,
      process_dt: today.toISOString(),
      form_name: currentTemplate || 'gmarket_erp',
      seq: 0,
      idx: `ORDER_${Date.now()}`,
      work_status: '',
      order_date: today.toISOString(),
      reg_date: '',
      ord_confirm_date: '',
      rtn_dt: '',
      chng_dt: '',
      delivery_confirm_date: '',
      cancel_dt: '',
      hope_delv_date: '',
      inv_send_dm: '',
      order_id: '',
      mall_order_id: '',
      product_id: '',
      product_name: '',
      mall_product_id: '',
      item_name: '',
      sku_value: '',
      sku_alias: '',
      sku_no: '',
      barcode: '',
      model_name: '',
      erp_model_name: '',
      location_nm: '',
      sale_cnt: 1,
      pay_cost: 0,
      delv_cost: 0,
      total_cost: 0,
      total_delv_cost: 0,
      expected_payout: 0,
      etc_cost: '',
      price_formula: '',
      service_fee: 0,
      sum_p_ea: 0,
      sum_expected_payout: 0,
      sum_pay_cost: 0,
      sum_delv_cost: 0,
      sum_total_cost: 0,
      receive_name: '',
      receive_cel: '',
      receive_tel: '',
      receive_addr: '',
      receive_zipcode: '',
      delivery_payment_type: '',
      delv_msg: '',
      delivery_id: '',
      delivery_class: '',
      invoice_no: '',
      fld_dsp: '',
      order_etc_6: '',
      order_etc_7: '',
      etc_msg: '',
      free_gift: '',
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };
  }, [currentTemplate]);

  const addNewRow = useCallback(async () => {
    if (!gridApi) return;
    
    try {
      const newRow = createEmptyRow();
      
      const result = gridApi.applyTransaction({
        add: [newRow],
        addIndex: 0
      });

      if (result && result.add && result.add.length > 0) {
        setTimeout(() => {
          const rowNode = gridApi.getRowNode(newRow.id?.toString() || '');
          if (rowNode) {
            gridApi.deselectAll();
            rowNode.setSelected(true);
            
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
      throw error;
    }
  }, [gridApi, createEmptyRow]);

  const addMultipleRows = useCallback(async (count: number = 5) => {
    if (!gridApi) return;
    
    try {
      const newRows = Array.from({ length: count }, () => createEmptyRow());
      
      const result = gridApi.applyTransaction({
        add: newRows,
        addIndex: 0
      });

      if (result && result.add && result.add.length > 0) {
        setTimeout(() => {
          const firstRowNode = gridApi.getRowNode(newRows[0].id?.toString() || '');
          if (firstRowNode) {
            gridApi.deselectAll();
            firstRowNode.setSelected(true);
            gridApi.ensureIndexVisible(firstRowNode.rowIndex!, 'top');
            gridApi.startEditingCell({
              rowIndex: firstRowNode.rowIndex!,
              colKey: 'order_id'
            });
          }
        }, 100);
        
        return newRows;
      }
    } catch (error) {
      console.error('여러 행 추가 중 오류 발생:', error);
      throw error;
    }
  }, [gridApi, createEmptyRow]);
    
  const deleteSelectedRows = useCallback(async () => {
    if (!gridApi) return;
    
    const selectedRowsData = gridApi.getSelectedRows();
    
    if (selectedRowsData.length === 0) {
      alert('삭제할 행을 선택해주세요.');
      return;
    }
    
    const confirmMessage = selectedRowsData.length === 1 
      ? `선택된 주문 "${selectedRowsData[0].order_id || '신규 주문'}"을 삭제하시겠습니까?`
      : `선택된 ${selectedRowsData.length}개 주문을 삭제하시겠습니까?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    try {
      const result = gridApi.applyTransaction({
        remove: selectedRowsData
      });
      
      if (result && result.remove && result.remove.length > 0) {
        gridApi.deselectAll();
        setSelectedRows([]);
        
        return result.remove;
      }
    } catch (error) {
      console.error('행 삭제 중 오류 발생:', error);
      throw error;
    }
  }, [gridApi, setSelectedRows]);

  const saveChangedRows = useCallback(async () => {
    if (!changedRows.length) {
      alert('저장할 변경사항이 없습니다.');
      return;
    }

    try {
      const response = await postBulkDownFormOrders({ items: changedRows });
      
      setChangedRows([]);
      
      alert(`${changedRows.length}개 행이 성공적으로 저장되었습니다.`);
      return response;
    } catch (error: any) {
      console.error('저장 중 오류 발생:', error);
      alert(`저장 실패: ${error.message || '알 수 없는 오류가 발생했습니다.'}`);
      throw error;
    }
  }, [changedRows, setChangedRows]);

  const duplicateSelectedRows = useCallback(async () => {
    if (!gridApi) return;
    
    const selectedRowsData = gridApi.getSelectedRows();
    
    if (selectedRowsData.length === 0) {
      alert('복사할 행을 선택해주세요.');
      return;
    }

    try {
      const duplicatedRows = selectedRowsData.map(row => ({
        ...row,
        id: 0,
        order_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const result = gridApi.applyTransaction({
        add: duplicatedRows,
        addIndex: 0
      });

      if (result && result.add && result.add.length > 0) {
        setTimeout(() => {
          const firstRowNode = gridApi.getRowNode(duplicatedRows[0].id?.toString() || '');
          if (firstRowNode) {
            gridApi.deselectAll();
            firstRowNode.setSelected(true);
            gridApi.ensureIndexVisible(firstRowNode.rowIndex!, 'top');
          }
        }, 100);
        
        return duplicatedRows;
      }
    } catch (error) {
      console.error('행 복사 중 오류 발생:', error);
      throw error;
    }
  }, [gridApi]);

  const getSelectedRows = useCallback((): OrderItem[] => {
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
    setSelectedRows([]);
  }, [gridApi, setSelectedRows]);

  const toggleRowSelection = useCallback((rowId: string) => {
    if (!gridApi) return;
    
    const rowNode = gridApi.getRowNode(rowId);
    if (rowNode) {
      rowNode.setSelected(!rowNode.isSelected());
    }
  }, [gridApi]);

  const refreshGrid = useCallback(() => {
    if (!gridApi) return;
    gridApi.refreshCells();
  }, [gridApi]);

  const clearFilters = useCallback(() => {
    if (!gridApi) return;
    gridApi.setFilterModel(null);
  }, [gridApi]);

  return {
    // 행 조작
    addNewRow,
    addMultipleRows,
    deleteSelectedRows,
    duplicateSelectedRows,
    saveChangedRows,
    
    // 선택 관리
    getSelectedRows,
    selectAllRows,
    deselectAllRows,
    toggleRowSelection,
    
    // 유틸리티
    refreshGrid,
    clearFilters,
    createEmptyRow,
    
    // 상태
    hasSelectedRows: selectedRows.length > 0,
    hasChangedRows: changedRows.length > 0,
    selectedRowCount: selectedRows.length,
    changedRowCount: changedRows.length
  };
};