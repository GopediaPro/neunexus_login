import { useState } from "react";
import { Button } from "../ui/Button";
import { ROUTERS } from "@/constant/route";
import { OrderRegisterModal } from "../ui/Modal/OrderRegisterModal";
import type { BatchInfoResponse, OrderRegisterForm } from "@/shared/types";
import { useOrderGridActions } from "@/utils/useOrderGridActions";
import { ExcelUploadModal } from "../ui/Modal/ExcelUploadModal";
import { useOrderContext } from "@/contexts/OrderContext";
import { BatchInfoAllModal } from "../ui/Modal/BatchInfoAllModal";
import { getBatchInfoAll } from "@/api/order/getBatchInfoAll";
import { useAuthContext } from "@/contexts";
import { Dropdown } from "../ui/Dropdown";
import { ChevronDown } from "lucide-react";
import { getBatchInfoLatest } from "@/api/order/getBatchInfoLatest";
import { BatchInfoModal } from "../ui/Modal/BatchInfoModal";
import { Icon } from "../ui/Icon";
import { deleteAll, deleteDuplicate } from "@/api/order";
import { ConfirmDeleteModal } from "../ui/Modal/ConfirmDeleteModal";
import { useOrderCreate, useOrderUpdate, useOrderDelete } from '@/hooks/orderManagement';
import { toast } from "sonner";

export const OrderToolbar = () => {
  const [isOrderRegisterModalOpen, setIsOrderRegisterModalOpen] = useState(false);
  const [isExcelUploadModalOpen, setIsExcelUploadModalOpen] = useState(false);
  const [isBatchInfoAllModalOpen, setIsBatchInfoAllModalOpen] = useState(false);
  const [isBatchInfoModalOpen, setIsBatchInfoModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [batchInfoAllData, setBatchInfoAllData] = useState<BatchInfoResponse | null>(null);
  const [selectedBatchInfoData, setSelectedBatchInfoData] = useState<BatchInfoResponse | null>(null);
  const [isBatchInfoAllLoading, setIsBatchInfoAllLoading] = useState(false);
  const [isSelectedBatchLoading, setIsSelectedBatchLoading] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deleteAction, setDeleteAction] = useState<'bulk' | 'duplicate' | 'selected' | null>(null);
  const { user } = useAuthContext();

  const {
    setActiveOrderTab,
    currentTemplate,
    setCurrentTemplate,
    gridApi,
    selectedRows,
    changedRows,
    activeOrderTab,
  } = useOrderContext();

  const bulkCreateMutation = useOrderCreate();
  const bulkUpdateMutation = useOrderUpdate();
  const bulkDeleteMutation = useOrderDelete();
  const { addNewRow } = useOrderGridActions(gridApi);

  const handleOrderRegisterSubmit = (data: OrderRegisterForm) => {
    if (data.selectedTemplate) {
      setCurrentTemplate(data.selectedTemplate);
    }
    setIsOrderRegisterModalOpen(false);
  };

  const handleOrderCreate = async () => {
    if (!gridApi) return;

    let allRows: any[] = [];
    gridApi.forEachNode((node: any) => {
      allRows = [...allRows, node.data];
    });

    const newRows = allRows.filter(row => 
      row.id && String(row.id).startsWith('temp_')
    );

    if (newRows.length === 0) {
      toast.error('생성할 새로운 주문이 없습니다.');
      return;
    }

    const invalidRows = newRows.filter(row => {
      return !row.order_id?.trim() || !row.product_name?.trim() || !row.sale_cnt || row.sale_cnt <= 0;
    });

    if (invalidRows.length > 0) {
      toast.error('주문ID, 상품명, 수량은 필수 입력 사항입니다.');
      return;
    }

    const confirmMessage = newRows.length === 1 
      ? `주문 "${newRows[0].order_id}"을 생성하시겠습니까?`
      : `새로운 ${newRows.length}개 주문을 생성하시겠습니까?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await bulkCreateMutation.mutateAsync({
        items: newRows.map(row => ({ 
          idx: row.idx || `ORDER${Date.now()}`,
          form_name: row.form_name || currentTemplate || "",
          order_id: row.order_id || "",
          product_name: row.product_name || "",
          sale_cnt: Number(row.sale_cnt) || 0,
          pay_cost: Number(row.pay_cost) || 0,
          delv_cost: Number(row.delv_cost) || 0,
          total_cost: Number(row.total_cost) || 0,
          receive_name: row.receive_name || "",
          receive_cel: row.receive_cel || "",
          receive_addr: row.receive_addr || ""
        })) as any
      });

      if (gridApi) {
        gridApi.applyTransaction({
          remove: newRows
        });
      }
      
    } catch (error) {
      console.error('주문 생성 실패:', error);
      toast.error('주문 생성에 실패했습니다.');
    }
  };

  const handleOrderUpdate = async () => {
    if (changedRows.length === 0) {
      toast.error('수정할 수 있는 유효한 주문이 없습니다.');
      return;
    }

    const invalidRows = changedRows.filter(row => {
      return !row.order_id?.trim() || !row.product_name?.trim() || !row.sale_cnt || row.sale_cnt <= 0;
    });

    if (invalidRows.length > 0) {
      toast.error('주문ID, 상품명, 수량은 필수 입력 사항입니다.');
      return;
    }

    const confirmMessage = changedRows.length === 1 
      ? `주문 "${changedRows[0].order_id}"을 수정하시겠습니까?`
      : `선택된 ${changedRows.length}개 주문을 수정하시겠습니까?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await bulkUpdateMutation.mutateAsync({
        items: changedRows.map(row => ({
          id: row.id,
          idx: row.idx || "",
          form_name: row.form_name || "",
          order_id: row.order_id || "",
          product_name: row.product_name || "",
          sale_cnt: Number(row.sale_cnt) || 0,
          pay_cost: Number(row.pay_cost) || 0,
          delv_cost: Number(row.delv_cost) || 0,
          total_cost: Number(row.total_cost) || 0,
          receive_name: row.receive_name || "",
          receive_cel: row.receive_cel || ""
        })) as any
      });

      if (gridApi) {
        gridApi.refreshCells();
        gridApi.deselectAll();
      }
      
    } catch (error) {
      console.error('주문 수정 실패:', error);
    }
  };

  const handleOrderDelete = () => {
    if (selectedRows.length === 0) {
      toast.error('삭제할 수 있는 유효한 주문이 없습니다.');
      return;
    }
    
    setDeleteAction('selected');
    setIsConfirmDeleteModalOpen(true);
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedRows.length === 0) {
      toast.error('삭제할 수 있는 유효한 주문이 없습니다.');
      return;
    }

    setDeleteAction('bulk');
    setIsConfirmDeleteModalOpen(true);
  };

  const handleDuplicateDeleteConfirm = () => {
    if (selectedRows.length === 0) {
      toast.error('삭제할 수 있는 유효한 주문이 없습니다.');
      return;
    }

    setDeleteAction('duplicate');
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteAction) return;

    try {
      setIsBulkDeleting(true);
      
      if (deleteAction === 'bulk') {
        await deleteAll();
        toast.success('일괄 삭제가 완료되었습니다.');
      } else if (deleteAction === 'duplicate') {
        await deleteDuplicate();
        toast.success('중복 삭제가 완료되었습니다.');
      } else if (deleteAction === 'selected') {
        const idsToDelete = selectedRows
          .map(row => row.id)
          .filter(id => id != null);

        if (idsToDelete.length === 0) {
          toast.error('삭제할 수 있는 유효한 주문이 없습니다.');
          return;
        }

        await bulkDeleteMutation.mutateAsync({
          ids: idsToDelete
        });

        if (gridApi) {
          gridApi.applyTransaction({
            remove: selectedRows
          });
          gridApi.deselectAll();
        }
        toast.success('선택된 주문이 삭제되었습니다.');
      }

      if (deleteAction === 'bulk' || deleteAction === 'duplicate') {
        if (gridApi) {
          gridApi.refreshInfiniteCache();
          gridApi.purgeInfiniteCache();
          gridApi.refreshCells();
        }
      }

    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      setIsBulkDeleting(false);
      setIsConfirmDeleteModalOpen(false);
      setDeleteAction(null);
    }
  };

  const handleExcelUploadSuccess = () => {
    toast.success('업로드가 완료되었습니다.');

    if (gridApi) {
      gridApi.refreshInfiniteCache();
      gridApi.purgeInfiniteCache();
      gridApi.refreshCells();
    }
  };

  const handleBatchInfoAll = async () => {
    try {
      setIsBatchInfoAllLoading(true);
      
      const batchInfo = await getBatchInfoAll({
        page: 1,
        page_size: 100
      });

      setBatchInfoAllData(batchInfo);
      setIsBatchInfoAllModalOpen(true);

    } catch (error) {
      console.error('배치 정보 조회 실패:', error);
      toast.error('배치 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsBatchInfoAllLoading(false);
    }
  };

  const handleSelectedBatchInfo = async () => {
    try {
      setIsSelectedBatchLoading(true);

      const batchInfo = await getBatchInfoLatest({
        page: 1,
        page_size: 100
      });

      setSelectedBatchInfoData(batchInfo);
      setIsBatchInfoModalOpen(true);

    } catch (error) {
      console.error('선택 주문 배치 정보 조회 실패:', error);
    } finally {
      setIsSelectedBatchLoading(false);
    }
  };

  const getDeleteModalContent = () => {
    if (deleteAction === 'bulk') {
      return {
        title: '일괄 삭제 확인',
        message: `모든 주문 데이터가 삭제됩니다.
         정말 삭제하시겠습니까?`
      };
    } else if (deleteAction === 'duplicate') {
      return {
        title: '중복 삭제 확인',
        message: `중복된 주문 데이터가 삭제됩니다. 정말 삭제하시겠습니까?`
      };
    } else if (deleteAction === 'selected') {
      const count = selectedRows.length;
      const orderName = count === 1 ? `"${selectedRows[0].order_id || '신규 주문'}"` : `${count}개 주문`;
      return {
        title: '선택 주문 삭제 확인',
        message: `선택된 ${orderName}을 삭제하시겠습니까?`
      };
    }
    return { title: '', message: '' };
  };

  const handleDataItems = [
    {
      label: '주문파일 업로드',
      onClick: () => setIsExcelUploadModalOpen(true),
    },
    {
      label: '전체 업로드 결과조회',
      onClick: handleBatchInfoAll,
      disabled: isBatchInfoAllLoading,
    },
    {
      label: '최근 업로드 결과조회',
      onClick: handleSelectedBatchInfo,
      disabled: isSelectedBatchLoading,
    },
  ];

  const handleBlukItems = [
    {
      label: '일괄 삭제',
      onClick: handleBulkDeleteConfirm,
    },
    {
      label: '중복 삭제',
      onClick: handleDuplicateDeleteConfirm,
    }
  ];

  const isCreateDisabled = bulkCreateMutation.isPending;
  const isUpdateDisabled = changedRows.length === 0 || bulkUpdateMutation.isPending;
  const isDeleteDisabled = selectedRows.length === 0 || bulkDeleteMutation.isPending;

  return (
    <>
      <div className="bg-fill-base-100">
        <div className="px-6">
          <div className="flex gap-2 border-b border-stroke-base-100">
            <button onClick={() => window.location.href = ROUTERS.PRODUCT_MANAGEMENT} className="px-4 py-2 text-text-base-400 text-h2 hover:text-primary-500 hover:bg-fill-alt-100 transition-colors">상품관리</button>
            <button className="px-4 py-4 text-primary-500 bg-fill-base-100 text-h2 border-b-2 border-primary-500">주문관리</button>
          </div>
        </div>
        <div className="flex gap-4 pt-6 px-6 bg-fill-base-100">
          <Button
            onClick={() => setActiveOrderTab("registration")}
            variant="light"
            className={`border border-stroke-base-100 transition-colors ${
              activeOrderTab === "registration"
                ? "bg-primary-400 text-text-contrast-500 hover:bg-primary-500"
                : "text-text-base-300 hover:text-text-base-400 bg-stroke-base-100 hover:bg-stroke-base-200"
            }`}>
            ERP
          </Button>
          <Button
            onClick={() => setActiveOrderTab("bulk-registration")}
            variant="light"
            className={`border border-stroke-base-100 transition-colors ${
              activeOrderTab === "bulk-registration"
                ? "bg-primary-400 text-text-contrast-500 hover:bg-primary-500"
                : "text-text-base-300 hover:text-text-base-400 bg-stroke-base-100 hover:bg-stroke-base-200"
            }`}>
            합포장
          </Button>
        </div>
        <div className="mt-6 px-6">
          <span className="text-h2">주문목록</span>
        </div>
      </div>
      <div className="flex items-center gap-4 px-6 pt-5 bg-fill-base-100">
        <div className="w-full flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <Button 
              variant="light" 
              size="sidebar"
              className={`py-5 ${isCreateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleOrderCreate}
              disabled={isCreateDisabled}
            >
              <Icon name="plus" ariaLabel="plus" style="w-4 h-4" />
              {bulkCreateMutation.isPending ? '등록 중...' : '주문 등록'}
            </Button>
            <Button variant="light" size="sidebar" className="py-5" onClick={() => setIsOrderRegisterModalOpen(true)}>
              <Icon name="folder" ariaLabel="folder" style="w-6 h-6 ml-[-2px]" />
              주문 불러오기
            </Button>
            <Button 
              variant="light" 
              size="sidebar"
              className={`py-5 ${isUpdateDisabled ? 'opacity-40 cursor-not-allowed' : ''} border-stroke-base-200`}
              onClick={handleOrderUpdate}
              disabled={isUpdateDisabled}
            >
              <Icon name="edit" ariaLabel="edit" style="w-4 h-4" />
              {bulkUpdateMutation.isPending ? '수정 중...' : `선택주문 수정${changedRows.length > 0 ? ` (${changedRows.length})` : ''}`}
            </Button>
            <Button variant="light" 
              size="sidebar"
              className={`py-5 ${isDeleteDisabled ? 'opacity-40 cursor-not-allowed' : ''} border-stroke-base-200`}
              onClick={handleOrderDelete}
              disabled={isDeleteDisabled}
            >
              <Icon name="trash" ariaLabel="trash" style="w-5 h-5" />
              {bulkDeleteMutation.isPending ? '삭제 중...' : `개별 주문 삭제${selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}`}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="light" size="sidebar" className="py-5" onClick={addNewRow}>행 추가</Button>
            <Dropdown
              trigger={
                <Button 
                  variant="light" 
                  size="sidebar"
                  className="py-5 flex items-center gap-1"
                >
                  일괄 작업
                  <ChevronDown size={24} className="text-text-base-400" />
                </Button>
              }
              items={handleBlukItems}
              align="right"
            />
            <Dropdown
              trigger={
                <Button 
                  variant="light" 
                  size="sidebar"
                  className="py-5 flex items-center gap-1"
                  disabled={isBatchInfoAllLoading}
                >
                  {isBatchInfoAllLoading ? '로딩 중...' : '데이터 관리'}
                  <ChevronDown size={24} className="text-text-base-400" />
                </Button>
              }
              items={handleDataItems}
              align="right"
            />
          </div>
        </div>
      </div>

      <OrderRegisterModal
        isOpen={isOrderRegisterModalOpen}
        onClose={() => setIsOrderRegisterModalOpen(false)}
        onSubmit={handleOrderRegisterSubmit}
      />

      <ExcelUploadModal
        isOpen={isExcelUploadModalOpen}
        onClose={() => setIsExcelUploadModalOpen(false)}
        onSuccess={handleExcelUploadSuccess}
        createdBy={user?.preferred_username || 'testuser'}
      />

      <BatchInfoAllModal
        isOpen={isBatchInfoAllModalOpen}
        onClose={() => setIsBatchInfoAllModalOpen(false)}
        batchInfo={batchInfoAllData}
      />

      <BatchInfoModal
        isOpen={isBatchInfoModalOpen}
        onClose={() => setIsBatchInfoModalOpen(false)}
        batchInfo={selectedBatchInfoData}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => {
          setIsConfirmDeleteModalOpen(false);
          setDeleteAction(null);
        }}
        onConfirm={handleConfirmDelete}
        title={getDeleteModalContent().title}
        message={getDeleteModalContent().message}
        isLoading={isBulkDeleting}
      />
    </>
  );
};