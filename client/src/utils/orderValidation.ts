import { toast } from "sonner";
import type { GridApi } from "ag-grid-community";
import type { DownFormBulkCreateResponse, OrderItem, ValidationResult } from "@/api/types";

interface OrderValidationResult {
  isValid: boolean;
  selectedRows: OrderItem[];
}

export const validateOrderCreation = (gridApi: GridApi | null): OrderValidationResult => {
  if (!gridApi) {
    toast.error('그리드가 초기화되지 않았습니다.');
    return { isValid: false, selectedRows: [] };
  }

  const selectedRows = gridApi.getSelectedRows();
  
  if (selectedRows.length === 0) {
    toast.error('생성할 새로운 주문이 없습니다.');
    return { isValid: false, selectedRows: [] };
  }

  return { isValid: true, selectedRows };
};

export const validateOrderIds = (selectedRows: OrderItem[]): ValidationResult => {
  const invalidRows = selectedRows.filter(row => !row.order_id);
  
  if (invalidRows.length > 0) {
    toast.error('주문 ID가 없는 행이 있습니다. 주문 ID를 확인해주세요.');
    return { 
      isValid: false, 
      errors: invalidRows.map((row, index) => ({
        index,
        field: 'order_id',
        message: '주문 ID가 필요합니다.',
        value: row.order_id
      }))
    };
  }

  return { isValid: true, errors: [] };
};

export const getConfirmationMessage = (selectedRows: OrderItem[]): string => {
  return selectedRows.length === 1 
    ? `주문 "${selectedRows[0].order_id}"을 생성하시겠습니까?`
    : `새로운 ${selectedRows.length}개 주문을 생성하시겠습니까?`;
};

export const confirmOrderCreation = (selectedRows: OrderItem[]): boolean => {
  const confirmMessage = getConfirmationMessage(selectedRows);
  return confirm(confirmMessage);
};


export const processCreateResult = (
  response: DownFormBulkCreateResponse, 
  selectedRows: OrderItem[], 
  gridApi: GridApi
): { successCount: number; failedCount: number } => {
  const successItems = response.items.filter(item => item.status === 'success');
  const failedItems = response.items.filter(item => item.status !== 'success');

  if (failedItems.length > 0) {
    console.error('일부 주문 생성 실패:', failedItems);
    toast.error(`${failedItems.length}개 주문 생성 실패. 상세 내용을 확인해주세요.`);
  }

  if (successItems.length > 0) {
    const { handleSuccess } = require("@/utils/errorHandler");
    handleSuccess(`${successItems.length}개 주문이 성공적으로 생성되었습니다.`);

    const successOrderIds = successItems.map(item => item.item.order_id);
    const newRows = selectedRows.filter(row => row.id && row.id !== 0);
    const rowsToRemove = newRows.filter(row => 
      successOrderIds.includes(row.order_id)
    );
    
    if (rowsToRemove.length > 0) {
      gridApi.applyTransaction({ remove: rowsToRemove });
    }
  }

  return { successCount: successItems.length, failedCount: failedItems.length };
};