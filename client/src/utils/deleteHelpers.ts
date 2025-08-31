import { deleteAll, deleteDuplicate } from "@/api/order";
import { handleDeleteError, handleSuccess } from "./errorHandler";
import type { DeleteResult, OrderItem } from "@/api/types";
import type { GridApi } from "ag-grid-community";

interface DeleteMutation {
  mutateAsync: (data: { ids: number[] }) => Promise<void>;
}

export const handleBulkDeleteAll = async (): Promise<DeleteResult> => {
  try {
    await deleteAll();
    handleSuccess('일괄 삭제가 완료되었습니다.');
    return { success: true, message: '일괄 삭제 완료' };
  } catch (error) {
    handleDeleteError(error, '일괄');
    return { success: false, message: '일괄 삭제 실패' };
  }
};

export const handleBulkDeleteDuplicate = async (): Promise<DeleteResult> => {
  try {
    const response = await deleteDuplicate();
    const message = (response as { message?: string }).message || '중복 삭제가 완료되었습니다.';
    handleSuccess(message);
    return { success: true, message };
  } catch (error) {
    handleDeleteError(error, '중복');
    return { success: false, message: '중복 삭제 실패' };
  }
};

export const handleSelectedRowsDelete = async (
  selectedRows: OrderItem[], 
  bulkDeleteMutation: DeleteMutation, 
  gridApi: GridApi | null
): Promise<DeleteResult> => {
  if (!gridApi) {
    return { success: false, message: '그리드 API가 없습니다.' };
  }

  try {
    const idsToDelete: number[] = selectedRows
      .map(row => row.id)
      .filter((id): id is number => id != null);

    if (idsToDelete.length === 0) {
      const { toast } = await import("sonner");
      toast.error('삭제할 수 있는 유효한 주문이 없습니다.');
      return { success: false, message: '삭제할 유효한 주문 없음' };
    }

    await bulkDeleteMutation.mutateAsync({ ids: idsToDelete });

    gridApi.applyTransaction({ remove: selectedRows });
    gridApi.deselectAll();
    
    handleSuccess('선택된 주문이 삭제되었습니다.');
    return { 
      success: true, 
      deletedCount: selectedRows.length,
      message: '선택 삭제 완료' 
    };
  } catch (error) {
    handleDeleteError(error, '선택');
    return { success: false, message: '선택 삭제 실패' };
  }
};

export const refreshGridData = (gridApi: GridApi | null): void => {
  if (!gridApi) return;
  
  const rowModelType = gridApi.getGridOption('rowModelType');
  
  if (rowModelType === 'infinite') {
    gridApi.refreshInfiniteCache();
    gridApi.purgeInfiniteCache();
  } else if (rowModelType === 'clientSide') {
    gridApi.refreshCells();
    gridApi.redrawRows();
  } else if (rowModelType === 'serverSide') {
    gridApi.refreshServerSide();
  } else {
    gridApi.refreshCells();
  }
};