import { postBulkDownFormOrders } from "@/api/order/postBulkDownFormOrders";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import type { BulkCreateOrderItem, BulkCreateRequest, DownFormBulkCreateResponse } from "@/shared/types";
import type { GridApi } from "ag-grid-community";
import { toast } from "sonner";

interface UseOrderCreateOptions {
  onSuccess?: (data: DownFormBulkCreateResponse) => void;
  onError?: (error: any) => void;
}

export const useOrderCreate = (options?: UseOrderCreateOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: BulkCreateRequest) => postBulkDownFormOrders(req),
    onSuccess: (data: DownFormBulkCreateResponse) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);

      console.error("대량 생성 실패:", error);
    },
  });
}; 

export const handleOrderCreate = async (gridApi: GridApi, bulkCreateMutation: UseMutationResult<DownFormBulkCreateResponse, Error, BulkCreateRequest>) => {  
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
    return !row.idx?.trim() ||        
           !row.order_id?.trim() || 
           !row.product_id?.trim() || 
           !row.product_name?.trim() || 
           !row.sale_cnt || 
           row.sale_cnt <= 0;
  });

  if (invalidRows.length > 0) {
    toast.error('IDX, 주문ID, 상품ID, 상품명, 수량은 필수 입력 사항입니다.');
    return;
  }

  const confirmMessage = newRows.length === 1 
    ? `주문 "${newRows[0].order_id}"을 생성하시겠습니까?`
    : `새로운 ${newRows.length}개 주문을 생성하시겠습니까?`;
  
  if (!confirm(confirmMessage)) {
    return;
  }

  try {
    const response = await bulkCreateMutation.mutateAsync({
      items: newRows.map(row => {
        const item: BulkCreateOrderItem = {
          idx: row.idx || `ORDER${Date.now()}`,
          form_name: row.form_name || "",
          order_id: row.order_id || "",
          product_id: row.product_id || "",
          product_name: row.product_name || "",
          barcode: row.barcode || null,
          delivery_class: row.delivery_class || null,
          delivery_id: row.delivery_id || null,
          delivery_payment_type: row.delivery_payment_type || null,
          delv_cost: String(row.delv_cost || 0),
          delv_msg: row.delv_msg || "",
          erp_model_name: row.erp_model_name || null,
          etc_cost: row.etc_cost || null,
          etc_msg: row.etc_msg || null,
          expected_payout: String(row.expected_payout || 0),
          fld_dsp: row.fld_dsp || "",
          free_gift: row.free_gift || null,
          invoice_no: row.invoice_no || null,
          item_name: row.item_name || null,
          location_nm: row.location_nm || null,
          mall_order_id: row.mall_order_id || "",
          mall_product_id: row.mall_product_id || "",
          model_name: row.model_name || null,
          order_etc_6: row.order_etc_6 || null,
          order_etc_7: row.order_etc_7 || null,
          pay_cost: String(row.pay_cost || 0),
          price_formula: row.price_formula || null,
          process_dt: row.process_dt || "",
          receive_addr: row.receive_addr || "",
          receive_cel: row.receive_cel || "",
          receive_name: row.receive_name || "",
          receive_tel: row.receive_tel || "",
          receive_zipcode: row.receive_zipcode || "",
          sale_cnt: Number(row.sale_cnt || 0),
          seq: row.seq || null,
          service_fee: String(row.service_fee || 0),
          sku_alias: row.sku_alias || null,
          sku_no: row.sku_no || null,
          sku_value: row.sku_value || "",
          sum_delv_cost: row.sum_delv_cost || null,
          sum_expected_payout: row.sum_expected_payout || null,
          sum_p_ea: row.sum_p_ea || null,
          sum_pay_cost: row.sum_pay_cost || null,
          sum_total_cost: row.sum_total_cost || null,
          total_cost: row.total_cost || null,
          total_delv_cost: row.total_delv_cost || null
        };

        return item;
      })
    });

    const successItems = response.items.filter(item => item.status === 'success');
    const failedItems = response.items.filter(item => item.status !== 'success');

    if (failedItems.length > 0) {
      console.error('일부 주문 생성 실패:', failedItems);
      toast.error(`${failedItems.length}개 주문 생성 실패. 상세 내용을 확인해주세요.`);
    }

    if (successItems.length > 0) {
      toast.success(`${successItems.length}개 주문이 성공적으로 생성되었습니다.`);
    }
    
  } catch (error: any) {
    console.error('주문 생성 실패:', error);
    
    if (error.response?.status === 422) {
      const errorMessage = error.response?.data?.message || '입력 데이터가 올바르지 않습니다.';
      toast.error(`검증 실패: ${errorMessage}`);
    } else {
      toast.error('주문 생성에 실패했습니다.');
    }
  }
};