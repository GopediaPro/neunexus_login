import { deleteAll, deleteDuplicate } from "@/api/order";
import { toast } from "sonner";
import { handleDeleteError } from "./errorHandler";


export const handleBulkDeleteAll = async () => {
  try {
    await deleteAll();
    toast.success('일괄 삭제가 완료되었습니다.');
    return { success: true };
  } catch (error) {
    handleDeleteError(error, '일괄');
    return { success: false };
  }
};

export const handleBulkDeleteDuplicate = async () => {
  try {
    const response = await deleteDuplicate();
    toast.success(response.message);
    return { success: true };
  } catch (error) {
    handleDeleteError(error, '중복');
    return { success: false };
  }
};

export const handleSelectedRowsDelete = async (
  selectedRows: any[], 
  bulkDeleteMutation: any, 
  gridApi: any
) => {
  try {
    const idsToDelete = selectedRows
      .map(row => row.id)
      .filter(id => id != null);

    if (idsToDelete.length === 0) {
      toast.error('삭제할 수 있는 유효한 주문이 없습니다.');
      return { success: false };
    }

    await bulkDeleteMutation.mutateAsync({ ids: idsToDelete });

    if (gridApi) {
      gridApi.applyTransaction({ remove: selectedRows });
      gridApi.deselectAll();
    }
    
    toast.success('선택된 주문이 삭제되었습니다.');
    return { success: true };
  } catch (error) {
    handleDeleteError(error, '선택');
    return { success: false };
  }
};

export const refreshGridData = (gridApi: any) => {
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