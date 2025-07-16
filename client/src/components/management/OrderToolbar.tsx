import { useState } from "react";
import { Button } from "../ui/Button";
import { ROUTERS } from "@/constant/route";
import { OrderRegisterModal } from "../ui/Modal/OrderRegisterModal";
import type { BatchInfoResponse, OrderRegisterForm } from "@/shared/types";
import { useOrderGridActions } from "@/utils/useOrderGridActions";
import { useBulkCreateOrders, useBulkDeleteOrders, useBulkUpdateOrders } from "@/hooks/orderManagement/useOrders";
import { ExcelUploadModal } from "../ui/Modal/ExcelUploadModal";
import { useOrderContext } from "@/contexts/OrderContext";
import { BatchInfoAllModal } from "../ui/Modal/BatchInfoAllModal";
import { getBatchInfoAll } from "@/api/order/getBatchInfoAll";
import { useAuthContext } from "@/contexts";
import { Dropdown } from "../ui/Dropdown";
import { ChevronDown } from "lucide-react";
import { getBatchInfoLatest } from "@/api/order/getBatchInfoLatest";
import { BatchInfoModal } from "../ui/Modal/BatchInfoModal";

export const OrderToolbar = () => {
  const [isOrderRegisterModalOpen, setIsOrderRegisterModalOpen] = useState(false);
  const [isExcelUploadModalOpen, setIsExcelUploadModalOpen] = useState(false);
  const [isBatchInfoAllModalOpen, setIsBatchInfoAllModalOpen] = useState(false);
  const [isBatchInfoModalOpen, setIsBatchInfoModalOpen] = useState(false);
  const [batchInfoAllData, setBatchInfoAllData] = useState<BatchInfoResponse | null>(null);
  const [selectedBatchInfoData, setSelectedBatchInfoData] = useState<BatchInfoResponse | null>(null);
  const [isBatchInfoAllLoading, setIsBatchInfoAllLoading] = useState(false);
  const [isSelectedBatchLoading, setIsSelectedBatchLoading] = useState(false);
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

  const bulkCreateMutation = useBulkCreateOrders();
  const bulkUpdateMutation = useBulkUpdateOrders();
  const bulkDeleteMutation = useBulkDeleteOrders();
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
      alert('생성할 새로운 주문이 없습니다.');
      return;
    }

    const invalidRows = newRows.filter(row => {
      return !row.order_id?.trim() || !row.product_name?.trim() || !row.sale_cnt || row.sale_cnt <= 0;
    });

    if (invalidRows.length > 0) {
      alert('주문ID, 상품명, 수량은 필수 입력 사항입니다.');
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
      alert('주문 생성에 실패했습니다.');
    }
  };

  const handleOrderUpdate = async () => {
    if (changedRows.length === 0) {
      return;
    }

    const invalidRows = changedRows.filter(row => {
      return !row.order_id?.trim() || !row.product_name?.trim() || !row.sale_cnt || row.sale_cnt <= 0;
    });

    if (invalidRows.length > 0) {
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

  const handleOrderDelete = async () => {
    if (selectedRows.length === 0) {
      return;
    }
    
    const confirmMessage = selectedRows.length === 1 
      ? `주문 "${selectedRows[0].order_id || '신규 주문'}"을 삭제하시겠습니까?`
      : `선택된 ${selectedRows.length}개 주문을 삭제하시겠습니까?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const idsToDelete = selectedRows
        .map(row => row.id)
        .filter(id => id != null);

      if (idsToDelete.length === 0) {
        alert('삭제할 수 있는 유효한 주문이 없습니다.');
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
      
    } catch (error) {
      console.error('주문 삭제 실패:', error);
    }
  };

  const handleExcelUploadSuccess = () => {
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
      alert('배치 정보를 불러오는데 실패했습니다.');
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

  const handleDataItems = [
    {
      label: '주문파일 업로드',
      onClick: () => setIsExcelUploadModalOpen(true),
      icon: 'upload'
    },
    {
      label: '전체 업로드 결과조회',
      onClick: handleBatchInfoAll,
      disabled: isBatchInfoAllLoading,
      icon: 'list'
    },
    {
      label: '최근 업로드 결과조회',
      onClick: handleSelectedBatchInfo,
      disabled: isSelectedBatchLoading,
      icon: 'filter'
    },
  ]

  const isCreateDisabled = bulkCreateMutation.isPending;
  const isUpdateDisabled = changedRows.length === 0 || bulkUpdateMutation.isPending;
  const isDeleteDisabled = selectedRows.length === 0 || bulkDeleteMutation.isPending;

  return (
    <>
      <div className="bg-fill-base-100">
        <div className="px-6">
          <div className="flex gap-2 border-b border-stroke-base-100">
            <button onClick={() => window.location.href = ROUTERS.PRODUCT_MANAGEMENT} className="px-4 py-2 text-text-base-400 text-h3 hover:text-primary-500 hover:bg-fill-alt-100 transition-colors">상품관리</button>
            <button className="px-4 py-4 text-primary-500 bg-fill-base-100 text-h3 border-b-2 border-primary-500">주문관리</button>
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
              className={`py-5 ${isCreateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleOrderCreate}
              disabled={isCreateDisabled}
            >
              {bulkCreateMutation.isPending ? '등록 중...' : '주문 등록'}
            </Button>
            <Button variant="light" className="py-5" onClick={() => setIsOrderRegisterModalOpen(true)}>주문 불러오기</Button>
            <Button 
              variant="light" 
              className={`py-5 ${isUpdateDisabled ? 'opacity-40 cursor-not-allowed' : ''} border-stroke-base-200`}
              onClick={handleOrderUpdate}
              disabled={isUpdateDisabled}
            >
              {bulkUpdateMutation.isPending ? '수정 중...' : `선택주문 수정${changedRows.length > 0 ? ` (${changedRows.length})` : ''}`}
            </Button>
            <Button variant="light" 
              className={`py-5 ${isDeleteDisabled ? 'opacity-40 cursor-not-allowed' : ''} border-stroke-base-200`}
              onClick={handleOrderDelete}
              disabled={isDeleteDisabled}
            >
            {bulkDeleteMutation.isPending ? '삭제 중...' : `주문 삭제${selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}`}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="light" className="py-5" onClick={addNewRow}>행 추가</Button>
            <Button variant="light" className="py-5" onClick={() => setIsExcelUploadModalOpen(true)}>
              엑셀 업로드
            </Button>
            <Dropdown
              trigger={
                <Button 
                  variant="light" 
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
    </>
  );
};