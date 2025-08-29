import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ROUTERS } from "@/constant/route";
import { OrderRegisterModal } from "@/components/ui/Modal/OrderRegisterModal";
import type { BatchInfoResponse, FormTemplate } from "@/api/types";
import { useOrderGridActions } from "@/hooks/orderManagement/useOrderGridActions";
import { useOrderContext } from "@/api/context/OrderContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { ChevronDown } from "lucide-react";
import { getBatchInfoLatest } from "@/api/order/getBatchInfoAll";
import { BatchInfoModal } from "@/components/ui/Modal/BatchInfoModal";
import { Icon } from "@/components/ui/Icon";
import { deleteAll, deleteDuplicate, getDownFormOrdersPagination } from "@/api/order";
import { useOrderDelete } from "@/api/order/deleteBulkDownFormOrders";
import { ConfirmDeleteModal } from "@/components/ui/Modal/ConfirmDeleteModal";
import { handleOrderCreate, handleOrderUpdate } from '@/hooks/orderManagement';
import { toast } from "sonner";
import { ExcelBulkUploadModal } from "@/components/ui/Modal/ExcelBulkUploadModal";
import { useOrderCreate } from "@/api/order/postBulkDownFormOrders";
import { useOrderUpdate } from "@/api/order/putBlukDownFormOrders";
import { OrderSabangNetMenu } from "./OrderSabangNetMenu";
import { SmileMacroBulkUploadModal } from "@/components/ui/Modal/SmileMacroBulkUploadModal";
import { DATA_FILTER_TABS } from "@/constant/order";
import { useModals } from "@/hooks/useModals";

export const OrderToolbar = () => {
  const { modals, openModal, closeModal } = useModals();

  const [selectedBatchInfoData, setSelectedBatchInfoData] = useState<BatchInfoResponse | null>(null);

  const [isSelectedBatchLoading, setIsSelectedBatchLoading] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const [deleteAction, setDeleteAction] = useState<'bulk' | 'duplicate' | 'selected' | null>(null);

  const {
    setActiveOrderTab,
    setCurrentTemplate,
    gridApi,
    selectedRows,
    changedRows,
    activeOrderTab,
    currentTemplate,
  } = useOrderContext();

  const {
    addNewRow,
    deleteSelectedRows,
    selectAllRows,
    deselectAllRows,
    hasSelectedRows,
  } = useOrderGridActions(gridApi);

  const bulkCreateMutation = useOrderCreate();
  const bulkUpdateMutation = useOrderUpdate();
  const bulkDeleteMutation = useOrderDelete();

  const refreshGrid = () => {
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

  const handleOrderRegisterSubmit = async (selectedTemplate: string) => {
    try {
      const response = await getDownFormOrdersPagination({
        page: 1,
        page_size: 200,
        template_code: selectedTemplate,
      });

      const orderData = response.items?.map((item: any) => item.content) || [];

      if (orderData.length === 0) {
        toast.error('템플릿에 해당하는 주문 데이터가 없습니다.');
        return;
      }

      setCurrentTemplate(selectedTemplate as FormTemplate);
      toast.dismiss();
      toast.success(`${orderData.length}개의 주문을 불러왔습니다.`);
    } catch (error) {
      console.error('주문 등록 실패:', error);
      toast.error('주문 등록에 실패했습니다.');
    }
    closeModal('orderRegister');
  };

  const handleOrderCreateClick = () => {
    if (!gridApi) return;
    handleOrderCreate(gridApi, bulkCreateMutation, currentTemplate);
  }

  const handleOrderUpdateClick = async () => {
    if (!gridApi) return;
    handleOrderUpdate(changedRows, bulkUpdateMutation, currentTemplate, gridApi);
  };

  const handleAddSingleRow = async () => {
    try {
      await addNewRow();
      toast.success('새 행이 추가되었습니다.');
    } catch (error) {
      console.error('행 추가 실패:', error);
      toast.error('행 추가에 실패했습니다.');
    }
  };

  const handleOrderDelete = () => {
    if (selectedRows.length === 0) {
      toast.error('삭제할 수 있는 유효한 주문이 없습니다.');
      return;
    }
    
    setDeleteAction('selected');
    openModal('confirmDelete');
  };

  const handleBulkDeleteConfirm = () => {
    setDeleteAction('bulk');
    openModal('confirmDelete');
  };

  const handleDuplicateDeleteConfirm = () => {
    setDeleteAction('duplicate');
    openModal('confirmDelete');
  };

  const handleConfirmDelete = async () => {
    if (!deleteAction) return;

    try {
      setIsBulkDeleting(true);
      
      if (deleteAction === 'bulk') {
        await deleteAll();
        toast.success('일괄 삭제가 완료되었습니다.');
      } else if (deleteAction === 'duplicate') {
        const response = await deleteDuplicate();
        toast.success(response.message);
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
        refreshGrid();
      }

    } catch (error) {
      console.error('삭제 실패:', error);
    } finally {
      setIsBulkDeleting(false);
      openModal('confirmDelete');
      setDeleteAction(null);
    }
  };

  const handleRowDelete = async () => {
    try {
      if (!hasSelectedRows) {
        toast.error('삭제할 행을 선택해주세요.');
        return;
      }
      await deleteSelectedRows();
    } catch (error) {
      console.error('행 삭제 실패:', error);
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
      openModal('batchInfo');

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
      label: '매크로 실행',
      onClick: () => openModal('excelBulk'),
    },
    {
      label: '최근 업로드 결과',
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

  const handleRowItems = [
    {
      label: '1개 행 추가',
      onClick: handleAddSingleRow,
    },
    {
      label: '선택 행 삭제',
      onClick: handleRowDelete,
      disabled: !hasSelectedRows,
    },
    {
      label: '전체 선택',
      onClick: selectAllRows,
      disabled: !gridApi,
    },
    {
      label: '선택 해제',
      onClick: deselectAllRows,
      disabled: !hasSelectedRows,
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
          {DATA_FILTER_TABS.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveOrderTab(tab.id)}
              variant="light"
              className={`border border-stroke-base-100 transition-colors ${
                activeOrderTab === tab.id
                  ? "bg-primary-400 text-text-contrast-500 hover:bg-primary-500"
                  : "text-text-base-300 hover:text-text-base-400 bg-stroke-base-100 hover:bg-stroke-base-200"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <OrderSabangNetMenu />

        <div className="mt-6 px-6">
          <span className="text-h2">주문목록</span>
        </div>
      </div>
      <div className="flex items-center gap-4 px-6 pt-5 bg-fill-base-100">
        <div className="w-full flex justify-between items-start gap-2">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button 
                variant="light" 
                size="sidebar"
                className={`py-5 ${isCreateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleOrderCreateClick}
                disabled={isCreateDisabled}
              >
                <Icon name="plus" ariaLabel="plus" style="w-4 h-4" />
                {bulkCreateMutation.isPending ? '등록 중...' : '주문 등록'}
              </Button>
              <Button variant="light" size="sidebar" className="py-5" onClick={() => closeModal('orderRegister')}>
                <Icon name="folder" ariaLabel="folder" style="w-6 h-6 ml-[-2px]" />
                주문 불러오기
              </Button>
              <Button 
                variant="light" 
                size="sidebar"
                className={`py-5 ${isUpdateDisabled ? 'opacity-40 cursor-not-allowed' : ''} border-stroke-base-200`}
                onClick={handleOrderUpdateClick}
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
              <Button 
                variant="light" 
                size="sidebar"
                className={`py-5 cursor-pointer border border-stroke-base-100 transition-colors`}
                onClick={() => {}}
              >
                <Icon name="boxes" ariaLabel="boxes" style="w-4 h-4" />
                전체 Macro
              </Button>
              <Button 
                variant="light" 
                size="sidebar"
                className={`py-5 cursor-pointer border border-stroke-base-100 transition-colors`}
                onClick={() => {}}
              >
                <Icon name="boxes" ariaLabel="boxes" style="w-4 h-4" />
                ERP Macro
              </Button>
              <Button 
                variant="light" 
                size="sidebar"
                className={`py-5 cursor-pointer border border-stroke-base-100 transition-colors`}
                onClick={() => {}}
              >
                <Icon name="boxes" ariaLabel="boxes" style="w-4 h-4" />
                합포장 Macro
              </Button>
              <Button 
                variant="light" 
                size="sidebar"
                className={`py-5 cursor-pointer border border-stroke-base-100 transition-colors`}
                onClick={() => openModal('smileMacro')}
              >
                <Icon name="boxes" ariaLabel="boxes" style="w-4 h-4" />
                스마일배송 업로드
              </Button>
              <Button 
                variant="light" 
                size="sidebar"
                className={`py-5 cursor-pointer border border-stroke-base-100 transition-colors`}
                onClick={() => {}}
              >
                <Icon name="boxes" ariaLabel="boxes" style="w-4 h-4" />
                ERP 업로드
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Dropdown
              trigger={
                <Button 
                  variant="light" 
                  size="sidebar"
                  className="py-5 flex items-center gap-1"
                >
                  행 관리
                  <ChevronDown size={24} className="text-text-base-400" />
                </Button>
              }
              items={handleRowItems}
              align="right"
            />
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
                >
                  데이터 관리
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
        isOpen={modals.orderRegister}
        onClose={() => closeModal('orderRegister')}
        onSubmit={handleOrderRegisterSubmit}
      />

      <ExcelBulkUploadModal
        isOpen={modals.excelBulk}
        onClose={() => closeModal('excelBulk')}
      />

      <SmileMacroBulkUploadModal 
        isOpen={modals.smileMacro}
        onClose={() => closeModal('smileMacro')}
      />

      <BatchInfoModal
        isOpen={modals.batchInfo}
        onClose={() => closeModal('batchInfo')}
        batchInfo={selectedBatchInfoData}
      />

      <ConfirmDeleteModal
        isOpen={modals.confirmDelete}
        onClose={() => {
          closeModal('confirmDelete');
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