import { putBlukDownFormOrders } from "@/api/order/putBlukDownFormOrders";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import type { BulkUpdateOrderItem, BulkUpdateRequest } from "@/shared/types";
import { toast } from "sonner";
import type { GridApi } from "ag-grid-community";

export const useOrderUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: BulkUpdateRequest) => putBlukDownFormOrders(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("대량 수정 실패:", error);
    },
  });
}; 

export const handleOrderUpdate = async (
  changedRows: BulkUpdateOrderItem[], 
  bulkUpdateMutation: UseMutationResult<any, Error, BulkUpdateRequest>, 
  currentTemplate: string = "gmarket_erp",
  gridApi: GridApi
) => {
  if (!gridApi) return;

  if (changedRows.length === 0) {
    toast.error('수정할 수 있는 유효한 주문이 없습니다.');
    return;
  }

  const invalidRows = changedRows.filter(row => {
    return !row.order_id?.trim() || !row.product_name?.trim() || 
    !row.sale_cnt || 
    row.sale_cnt <= 0;
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
    const requestData = {
      items: changedRows.map((row, index) => {
        const currentDateTime = new Date().toISOString();
        
        const item = {
          id: row.id,
          
          idx: row.idx || `UPD_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 6)}`,
          form_name: row.form_name?.trim() || currentTemplate,
          order_id: row.order_id?.trim() || "",
          product_id: row.product_id?.trim() || row.order_id || `PROD_UPD_${Date.now()}`,
          product_name: row.product_name?.trim() || "",
          process_dt: row.process_dt?.trim() ? row.process_dt : currentDateTime,
          sale_cnt: row.sale_cnt ? Number(row.sale_cnt) : 1,
          delv_cost: row.delv_cost !== undefined && row.delv_cost !== null ? String(row.delv_cost) : undefined,
          pay_cost: row.pay_cost !== undefined && row.pay_cost !== null ? String(row.pay_cost) : undefined,
          expected_payout: row.expected_payout !== undefined && row.expected_payout !== null ? String(row.expected_payout) : undefined,
          service_fee: row.service_fee !== undefined && row.service_fee !== null ? String(row.service_fee) : undefined,
          delv_msg: row.delv_msg !== undefined ? row.delv_msg : undefined,
          fld_dsp: row.fld_dsp !== undefined ? row.fld_dsp : undefined,
          mall_order_id: row.mall_order_id !== undefined ? row.mall_order_id : undefined,
          receive_addr: row.receive_addr !== undefined ? row.receive_addr : undefined,
          receive_cel: row.receive_cel !== undefined ? row.receive_cel : undefined,
          receive_name: row.receive_name !== undefined ? row.receive_name : undefined,
          receive_tel: row.receive_tel !== undefined ? row.receive_tel : undefined,
          receive_zipcode: row.receive_zipcode !== undefined ? row.receive_zipcode : undefined,
          
          barcode: row.barcode !== undefined ? row.barcode : undefined,
          delivery_class: row.delivery_class !== undefined ? row.delivery_class : undefined,
          delivery_id: row.delivery_id !== undefined ? row.delivery_id : undefined,
          delivery_payment_type: row.delivery_payment_type !== undefined ? row.delivery_payment_type : undefined,
          erp_model_name: row.erp_model_name !== undefined ? row.erp_model_name : undefined,
          etc_cost: row.etc_cost !== undefined ? row.etc_cost : undefined,
          etc_msg: row.etc_msg !== undefined ? row.etc_msg : undefined,
          free_gift: row.free_gift !== undefined ? row.free_gift : undefined,
          invoice_no: row.invoice_no !== undefined ? row.invoice_no : undefined,
          item_name: row.item_name !== undefined ? row.item_name : undefined,
          location_nm: row.location_nm !== undefined ? row.location_nm : undefined,
          model_name: row.model_name !== undefined ? row.model_name : undefined,
          order_etc_6: row.order_etc_6 !== undefined ? row.order_etc_6 : undefined,
          order_etc_7: row.order_etc_7 !== undefined ? row.order_etc_7 : undefined,
          price_formula: row.price_formula !== undefined ? row.price_formula : undefined,
          seq: row.seq !== undefined ? row.seq : undefined,
          sku_alias: row.sku_alias !== undefined ? row.sku_alias : undefined,
          sku_no: row.sku_no !== undefined ? row.sku_no : undefined,
          sku_value: row.sku_value !== undefined ? row.sku_value : undefined,
          sum_delv_cost: row.sum_delv_cost !== undefined ? row.sum_delv_cost : undefined,
          sum_expected_payout: row.sum_expected_payout !== undefined ? row.sum_expected_payout : undefined,
          sum_p_ea: row.sum_p_ea !== undefined ? row.sum_p_ea : undefined,
          sum_pay_cost: row.sum_pay_cost !== undefined ? row.sum_pay_cost : undefined,
          sum_total_cost: row.sum_total_cost !== undefined ? row.sum_total_cost : undefined,
          total_cost: row.total_cost !== undefined ? row.total_cost : undefined,
          total_delv_cost: row.total_delv_cost !== undefined ? row.total_delv_cost : undefined
        };

        const cleanedItem = Object.fromEntries(
          Object.entries(item).filter(([key, value]) => {
            const requiredFields = ['id', 'idx', 'form_name', 'order_id', 'product_id', 'product_name', 'process_dt', 'sale_cnt'];
            if (requiredFields.includes(key)) {
              return true;
            }
            
            if (value === undefined) {
              return false;
            }
            
            if (typeof value === 'string' && value === '') {
              return false;
            }
            
            return true;
          })
        );

        return cleanedItem as BulkUpdateOrderItem & { id: number };
      })
    };

    await bulkUpdateMutation.mutateAsync(requestData);

    if (gridApi) {
      gridApi.refreshCells();
      gridApi.deselectAll();
    }

    toast.success(`${changedRows.length}개 주문이 성공적으로 수정되었습니다.`);
    
  } catch (error: any) {
    console.error('주문 수정 실패:', error);
    
    if (error.response?.status === 422) {
      console.error('422 에러 상세:', error.response.data);
      const errorMessage = error.response?.data?.message || '수정 데이터가 올바르지 않습니다.';
      toast.error(`수정 검증 실패: ${errorMessage}`);
    } else {
      toast.error('주문 수정에 실패했습니다.');
    }
  }
}