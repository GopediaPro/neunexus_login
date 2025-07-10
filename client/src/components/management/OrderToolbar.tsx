import { useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";
import { OrderRegisterModal } from "../ui/Modal/OrderRegisterModal";
import type { OrderRegisterForm } from "@/shared/types";
import { useOrderGridActions } from "@/utils/useOrderGridActions";
import { useBulkDeleteOrders, useBulkUpdateOrders } from "@/hooks/orderManagement/useOrders";
interface OrderToolbarProps {
  onTemplateChange: (templateCode: string) => void;
  gridApi: any;
  originalData: any[];
  selectedRows: any[];
  currentTemplate: string;
  changedRows?: any[];
}

export const OrderToolbar = ({ 
  onTemplateChange,
  gridApi,
  originalData,
  selectedRows,
  currentTemplate,
  changedRows = [] 
}: OrderToolbarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const naviagte = useNavigate();
  const [isOrderRegisterModalOpen, setIsOrderRegisterModalOpen] = useState(false);

  // const bulkCreateMutation = useBulkCreateOrders();
  const bulkUpdateMutation = useBulkUpdateOrders();
  const bulkDeleteMutation = useBulkDeleteOrders();
  const { addNewRow, deleteSelectedRows } = useOrderGridActions(gridApi);

  const handleIconClick = () => {
    inputRef.current?.focus();
  }

  const handleOrderRegisterSubmit = (data: OrderRegisterForm) => {
    if (data.selectedTemplate) {
      onTemplateChange(data.selectedTemplate);
    }
    setIsOrderRegisterModalOpen(false);
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
          // 기본 필수 필드
          id: row.id,
          process_dt: row.process_dt || new Date().toISOString(),
          
          // 폼 및 순서 관련
          form_name: row.form_name || "",
          seq: row.seq || 0,
          idx: row.idx || "",
          
          // 주문 정보
          order_id: row.order_id || "",
          mall_order_id: row.mall_order_id || "",
          
          // 상품 정보
          product_id: row.product_id || "",
          product_name: row.product_name || "",
          mall_product_id: row.mall_product_id || "",
          item_name: row.item_name || "",
          sku_value: row.sku_value || "",
          sku_alias: row.sku_alias || "",
          sku_no: row.sku_no || "",
          barcode: row.barcode || "",
          model_name: row.model_name || "",
          erp_model_name: row.erp_model_name || "",
          location_nm: row.location_nm || "",
          
          // 수량 및 가격 정보
          sale_cnt: Number(row.sale_cnt) || 0,
          pay_cost: Number(row.pay_cost) || 0,
          delv_cost: Number(row.delv_cost) || 0,
          total_cost: Number(row.total_cost) || 0,
          total_delv_cost: Number(row.total_delv_cost) || 0,
          expected_payout: Number(row.expected_payout) || 0,
          etc_cost: Number(row.etc_cost) || 0,
          price_formula: row.price_formula || "",
          service_fee: Number(row.service_fee) || 0,
          
          // 합계 정보
          sum_p_ea: Number(row.sum_p_ea) || 0,
          sum_expected_payout: Number(row.sum_expected_payout) || 0,
          sum_pay_cost: Number(row.sum_pay_cost) || 0,
          sum_delv_cost: Number(row.sum_delv_cost) || 0,
          sum_total_cost: Number(row.sum_total_cost) || 0,
          
          // 배송 정보
          receive_name: row.receive_name || "",
          receive_cel: row.receive_cel || "",
          receive_tel: row.receive_tel || "",
          receive_addr: row.receive_addr || "",
          receive_zipcode: row.receive_zipcode || "",
          delivery_payment_type: row.delivery_payment_type || "",
          delv_msg: row.delv_msg || "",
          delivery_id: row.delivery_id || "",
          delivery_class: row.delivery_class || "",
          invoice_no: row.invoice_no || "",
          
          // 기타 정보
          fld_dsp: row.fld_dsp || "",
          order_etc_6: row.order_etc_6 || "",
          order_etc_7: row.order_etc_7 || "",
          etc_msg: row.etc_msg || "",
          free_gift: row.free_gift || "",
          
          // 타임스탬프
          created_at: row.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })) as any
      });

      // 그리드 새로고침
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

  const isUpdateDisabled = changedRows.length === 0 || bulkUpdateMutation.isPending;
  const isDeleteDisabled = selectedRows.length === 0 || bulkDeleteMutation.isPending;
  const isRowDeleteDisabled = selectedRows.length === 0;

  return (
    <>
      <div>
        <div className="px-6 bg-fill-base-200">
          <div className="flex gap-2 border-b border-stroke-base-100">
            <button onClick={() => naviagte(ROUTERS.PRODUCT_MANAGAMENT)} className="px-4 py-2 text-text-base-400 text-h3 hover:text-primary-500 hover:bg-fill-alt-100 transition-colors">상품관리</button>
            <button className="px-4 py-4 text-primary-500 bg-fill-base-100 text-h3 border-b-2 border-primary-500">주문관리</button>
          </div>
        </div>
        <div className="flex gap-4 pt-6 px-6 bg-fill-base-100">
          <Button 
            size="lg" 
            className={`border border-stroke-base-100 transition-colors`}>
            주문등록
          </Button>
          <Button 
            size="lg" 
            className={`border border-stroke-base-100 transition-colors`}>
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
            placeholder="전체 검색 (상품명, ID, 고객명 등)"
            className="w-[280px] pl-4 h-10 bg-fill-alt-100 border-none relative"
          />
        </div> 

        <div className="flex items-center gap-2">
          <Button variant="light" className="py-5" onClick={() => setIsOrderRegisterModalOpen(true)}>주문 호출</Button>
          <Button variant="light" className="py-5">주문 추가</Button>
          <Button 
            variant="light" 
            className={`py-5 ${isUpdateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleOrderUpdate}
            disabled={isUpdateDisabled}
          >
            {bulkUpdateMutation.isPending ? '수정 중...' : `주문 수정${changedRows.length > 0 ? ` (${changedRows.length})` : ''}`}
          </Button>
          <Button variant="light" 
            className={`py-5 ${isDeleteDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleOrderDelete}
            disabled={isDeleteDisabled}
          >
          {bulkDeleteMutation.isPending ? '삭제 중...' : `주문 삭제${selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}`}
          </Button>
          <Button variant="light" className="py-5" onClick={addNewRow}>행 추가</Button>
          <Button variant="light" className="py-5" onClick={handleRowDelete} disabled={isRowDeleteDisabled}>
            행 삭제{selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}
          </Button>
        </div>
      </div>

      <OrderRegisterModal
        isOpen={isOrderRegisterModalOpen}
        onClose={() => setIsOrderRegisterModalOpen(false)}
        onSubmit={handleOrderRegisterSubmit}
      />
    </>
  );
};