import { useCallback, useRef } from "react";
import type { GridApi } from "ag-grid-community";
import { useProductContext } from "@/api/context/ProductContext";
import type { ProductFormData, ProductItem, ProductUpdateFormData } from "@/api/types/product.types";
import { toast } from "sonner";

export const useProductGridActions = (gridApi: GridApi | null) => {
  const {
    selectedRows,
    setSelectedRows,
    changedRows,
    setChangedRows,
  } = useProductContext();

  const newRowCounter = useRef(0);

  const createEmptyRow = useCallback((): ProductItem => {
    const tempId = `new_${Date.now()}_${++newRowCounter.current}`;

    return {
      id: tempId as any,
      product_nm: '',
      goods_nm: '',
      detail_path_img: '',
      delv_cost: 0,
      goods_search: '',
      goods_price: 0,
      stock_use_yn: 'N',
      certno: '',
      char_process: '',
      char_1_nm: '',
      char_1_val: '',
      char_2_nm: '',
      char_2_val: '',
      img_path: '',
      img_path1: '',
      img_path2: '',
      img_path3: '',
      img_path4: '',
      img_path5: '',
      goods_remarks: '',
      mobile_bn: '',
      one_plus_one_bn: '',
      goods_remarks_url: '',
      delv_one_plus_one: '',
      delv_one_plus_one_detail: '',
      class_nm1: '',
      class_nm2: '',
      class_nm3: '',
      class_nm4: '',
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
        const addedNode = result.add[0];

        setTimeout(() => {
          // const rowNode = gridApi.getRowNode(newRow.id?.toString() || '');          
          if (addedNode) {
            gridApi.deselectAll();
            addedNode.setSelected(true);

            if (typeof addedNode.rowIndex == 'number') {
              gridApi.ensureIndexVisible(addedNode.rowIndex, 'top');

              gridApi.startEditingCell({
                rowIndex: addedNode.rowIndex,
                colKey: 'goods_nm'
              });
            }
          }
          // if (rowNode) {
            // gridApi.deselectAll();
            // rowNode.setSelected(true);
            
            // gridApi.ensureIndexVisible(rowNode.rowIndex!, 'top');
            
          //   gridApi.startEditingCell({
          //     rowIndex: rowNode.rowIndex!,
          //     colKey: 'goods_nm'
          //   });
          // }
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
      toast.error('행 삭제 중 오류가 발생했습니다.');
      throw error;
    }
  }, [gridApi, setSelectedRows]);

  const selectAllRows = useCallback(() => {
    if (!gridApi) return;
    gridApi.selectAll();
    const allRows: ProductUpdateFormData[] = [];
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