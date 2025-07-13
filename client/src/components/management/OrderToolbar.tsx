import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/input";
import { ROUTERS } from "@/constant/route";
import { OrderRegisterModal } from "../ui/Modal/OrderRegisterModal";
import type { OrderRegisterForm } from "@/shared/types";
import { useOrderGridActions } from "@/utils/useOrderGridActions";
import { useBulkCreateOrders, useBulkDeleteOrders, useBulkUpdateOrders } from "@/hooks/orderManagement/useOrders";
import { ExcelUploadModal } from "../ui/Modal/ExcelUploadModal";
import { useOrderContext } from "@/contexts/OrderContext";

export const OrderToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOrderRegisterModalOpen, setIsOrderRegisterModalOpen] = useState(false);
  const [isExcelUploadModalOpen, setIsExcelUploadModalOpen] = useState(false);

  const {
    search,
    setSearch,
    setActiveOrderTab,
    currentTemplate,
    setCurrentTemplate,
    gridApi,
    selectedRows,
    changedRows,
  } = useOrderContext();

  const bulkCreateMutation = useBulkCreateOrders();
  const bulkUpdateMutation = useBulkUpdateOrders();
  const bulkDeleteMutation = useBulkDeleteOrders();
  const { addNewRow, deleteSelectedRows } = useOrderGridActions(gridApi);

  const handleIconClick = () => {
    inputRef.current?.focus();
  };

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

  const handleRowDelete = () => {
    if (selectedRows.length === 0) {
      return;
    }
    
    const confirmMessage = selectedRows.length === 1 
      ? `주문 "${selectedRows[0].order_id || '신규 주문'}"을 삭제하시겠습니까?`
      : `선택된 ${selectedRows.length}개 주문을 삭제하시겠습니까?`;
    
    if (confirm(confirmMessage)) {
      deleteSelectedRows();
    }
  };

  const handleExcelUploadSuccess = () => {
    if (gridApi) {
      gridApi.refreshInfiniteCache();
      gridApi.purgeInfiniteCache();
      gridApi.refreshCells();
    }
  };

  const isCreateDisabled = bulkCreateMutation.isPending;
  const isUpdateDisabled = changedRows.length === 0 || bulkUpdateMutation.isPending;
  const isDeleteDisabled = selectedRows.length === 0 || bulkDeleteMutation.isPending;
  const isRowDeleteDisabled = selectedRows.length === 0;

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
            nameType="sidebarMenu"
            className={`border border-stroke-base-100 transition-colors`}
            onClick={() => setActiveOrderTab("registration")}
          >
            주문등록
          </Button>
          <Button 
            nameType="sidebarMenu"
            className={`border border-stroke-base-100 transition-colors`}
            onClick={() => setActiveOrderTab("bulk-registration")}
          >
            대량주문등록
          </Button>
        </div>
        <div className="mt-6 px-6">
          <span className="text-h2">주문목록</span>
        </div>
      </div>
      <div className="flex items-center gap-4 px-6 pt-5 bg-fill-base-100">
        <div className="flex items-center w-[320px] h-10 bg-fill-alt-100 rounded-md px-3">
          <Icon name="search" ariaLabel="검색" 
            onClick={handleIconClick}
            style="w-5 h-5 text-text-base-400 cursor-pointer flex-shrink-0"/>
          <Input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="전체 검색 (상품명, ID, 고객명 등)"
            className="w-[280px] pl-4 h-10 bg-fill-alt-100 border-none relative"
          />
        </div> 

        <div className="flex items-center gap-2">
          <Button nameType="sidebarMenu" className="py-5" onClick={() => setIsOrderRegisterModalOpen(true)}>주문 호출</Button>
          <Button 
            nameType="sidebarMenu" 
            className={`py-5 ${isCreateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleOrderCreate}
            disabled={isCreateDisabled}
          >
            {bulkCreateMutation.isPending ? '생성 중...' : '주문 생성'}
          </Button>
          <Button 
            nameType="sidebarMenu" 
            className={`py-5 ${isUpdateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleOrderUpdate}
            disabled={isUpdateDisabled}
          >
            {bulkUpdateMutation.isPending ? '수정 중...' : `주문 수정${changedRows.length > 0 ? ` (${changedRows.length})` : ''}`}
          </Button>
          <Button nameType="sidebarMenu" 
            className={`py-5 ${isDeleteDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleOrderDelete}
            disabled={isDeleteDisabled}
          >
          {bulkDeleteMutation.isPending ? '삭제 중...' : `주문 삭제${selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}`}
          </Button>
          <Button nameType="sidebarMenu" className="py-5" onClick={addNewRow}>행 추가</Button>
          <Button nameType="sidebarMenu" className="py-5" onClick={handleRowDelete} disabled={isRowDeleteDisabled}>
            행 삭제{selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}
          </Button>
          <Button nameType="sidebarMenu" className="py-5" onClick={() => setIsExcelUploadModalOpen(true)}>
            엑셀 업로드
          </Button>
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
      />
    </>
  );
};