import { useCallback } from "react";
import type { GridApi } from "ag-grid-community";
import { useProductContext } from "@/api/context/ProductContext";
import { toast } from "sonner";

export interface ProductItem {
  id?: number;
  goods_nm: string;
  brand_nm?: string;
  goods_price: number;
  goods_consumer_price?: number;
  status?: number;
  maker?: string;
  origin?: string;
  good_keyword?: string;
  char_1_nm?: string;
  char_1_val?: string;
  char_2_nm?: string;
  char_2_val?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProductGridActions = (gridApi: GridApi | null) => {
  const {
    selectedRows,
    setSelectedRows,
    changedRows,
    setChangedRows,
  } = useProductContext();

  const createEmptyRow = useCallback((): ProductItem => {
    return {
      id: Date.now(),
      goods_nm: '',
      brand_nm: '',
      goods_price: 0,
      goods_consumer_price: 0,
      status: 1,
      maker: '',
      origin: 'KR',
      good_keyword: '',
      char_1_nm: '',
      char_1_val: '',
      char_2_nm: '',
      char_2_val: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }, []);

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
              colKey: 'goods_nm'
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

  const deleteSelectedRows = useCallback(async () => {
    if (!gridApi) return;
    
    const selectedRowsData = gridApi.getSelectedRows();
    
    if (selectedRowsData.length === 0) {
      toast.error('삭제할 행을 선택해주세요.');
      return;
    }
    
    try {
      const result = gridApi.applyTransaction({
        remove: selectedRowsData
      });
      
      if (result && result.remove && result.remove.length > 0) {
        gridApi.deselectAll();
        setSelectedRows([]);
        toast.success(`${selectedRowsData.length}개 행이 삭제되었습니다.`);
        return result.remove;
      }
    } catch (error) {
      console.error('행 삭제 중 오류 발생:', error);
      toast.error('행 삭제 중 오류가 발생했습니다.');
      throw error;
    }
  }, [gridApi, setSelectedRows]);

  const selectAllRows = useCallback(() => {
    if (!gridApi) return;
    gridApi.selectAll();
    const allRows = [];
    gridApi.forEachNode(node => {
      if (node.data) {
        allRows.push(node.data);
      }
    });
    setSelectedRows(allRows);
  }, [gridApi, setSelectedRows]);

  const deselectAllRows = useCallback(() => {
    if (!gridApi) return;
    gridApi.deselectAll();
    setSelectedRows([]);
  }, [gridApi, setSelectedRows]);

  const refreshGrid = useCallback(() => {
    if (!gridApi) return;
    gridApi.refreshCells();
  }, [gridApi]);

  return {
    addNewRow,
    deleteSelectedRows,
    selectAllRows,
    deselectAllRows,
    refreshGrid,
    createEmptyRow,
    hasSelectedRows: selectedRows.length > 0,
    hasChangedRows: changedRows.length > 0,
    selectedRowCount: selectedRows.length,
    changedRowCount: changedRows.length
  };
};