import { postBulkDownFormOrders } from "@/api/order/postBulkDownFormOrders";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import type { BulkCreateOrderItem, BulkCreateRequest, DownFormBulkCreateResponse } from "@/api/types";
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

export const handleOrderCreate = async (
  gridApi: GridApi, 
  bulkCreateMutation: UseMutationResult<DownFormBulkCreateResponse, Error, BulkCreateRequest>,
  currentTemplate: string = "gmarket_erp"
) => {  
  if (!gridApi) return;

  const selectedRows = gridApi.getSelectedRows();
  
  if (selectedRows.length === 0) {
    toast.error('생성할 새로운 주문이 없습니다.');
    return;
  }

  const newRows = selectedRows.filter(row => 
    row.id && row.id !== 0
  );

  const invalidRows = selectedRows.filter(row => !row.order_id);
  
  if (invalidRows.length > 0) {
    toast.error('주문 ID가 없는 행이 있습니다. 주문 ID를 확인해주세요.');
    return;
  }

  const confirmMessage = selectedRows.length === 1 
    ? `주문 "${selectedRows[0].order_id}"을 생성하시겠습니까?`
    : `새로운 ${selectedRows.length}개 주문을 생성하시겠습니까?`;
  
  if (!confirm(confirmMessage)) {
    return;
  }

  try {
    const requestData = {
      items: selectedRows.map((row, index) => {
        const content: any = {
          id: 0,
          process_dt: row.process_dt?.trim() ? row.process_dt : new Date().toISOString(),
          form_name: row.form_name || currentTemplate,
          seq: row.seq ? Number(row.seq) : 1,
          idx: row.idx || `ORDER_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 6)}`,
          work_status: row.work_status || "pending",
          order_date: row.order_date ? new Date(row.order_date).toISOString() : new Date().toISOString(),
          reg_date: row.reg_date || new Date().toISOString().split('T')[0],
          ord_confirm_date: row.ord_confirm_date || new Date().toISOString().split('T')[0],
          rtn_dt: row.rtn_dt || "",
          chng_dt: row.chng_dt || "",
          delivery_confirm_date: row.delivery_confirm_date || "",
          cancel_dt: row.cancel_dt || "",
          hope_delv_date: row.hope_delv_date || "",
          inv_send_dm: row.inv_send_dm || "",
          order_id: row.order_id || "",
          mall_order_id: row.mall_order_id || "",
          product_id: row.product_id?.trim() || `PROD_${row.order_id || Date.now()}`,
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
          sale_cnt: row.sale_cnt ? Number(row.sale_cnt) : 2,
          pay_cost: row.pay_cost ? Number(row.pay_cost) : 25000,
          delv_cost: row.delv_cost ? Number(row.delv_cost) : 3000,
          total_cost: row.total_cost ? Number(row.total_cost) : 28000,
          total_delv_cost: row.total_delv_cost ? Number(row.total_delv_cost) : 3000,
          expected_payout: row.expected_payout ? Number(row.expected_payout) : 22000,
          etc_cost: row.etc_cost || "500",
          price_formula: row.price_formula || "기본가격 + 배송비",
          service_fee: row.service_fee ? Number(row.service_fee) : 1000,
          sum_p_ea: row.sum_p_ea ? Number(row.sum_p_ea) : 2,
          sum_expected_payout: row.sum_expected_payout ? Number(row.sum_expected_payout) : 22000,
          sum_pay_cost: row.sum_pay_cost ? Number(row.sum_pay_cost) : 25000,
          sum_delv_cost: row.sum_delv_cost ? Number(row.sum_delv_cost) : 3000,
          sum_total_cost: row.sum_total_cost ? Number(row.sum_total_cost) : 28000,
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
          fld_dsp: row.fld_dsp || "",
          order_etc_6: row.order_etc_6 || "",
          order_etc_7: row.order_etc_7 || "",
          etc_msg: row.etc_msg || "",
          free_gift: row.free_gift || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return content as BulkCreateOrderItem;
      })
    };

    const response = await bulkCreateMutation.mutateAsync(requestData);

    const successItems = response.items.filter(item => item.status === 'success');
    const failedItems = response.items.filter(item => item.status !== 'success');

    if (failedItems.length > 0) {
      console.error('일부 주문 생성 실패:', failedItems);
      toast.error(`${failedItems.length}개 주문 생성 실패. 상세 내용을 확인해주세요.`);
    }

    if (successItems.length > 0) {
      toast.success(`${successItems.length}개 주문이 성공적으로 생성되었습니다.`);

      if (gridApi) {
        const successOrderIds = successItems.map(item => item.item.order_id);
        const rowsToRemove = newRows.filter(row => 
          successOrderIds.includes(row.order_id)
        );
        
        if (rowsToRemove.length > 0) {
          gridApi.applyTransaction({
            remove: rowsToRemove
          });
        }
      }
    }
    
  } catch (error: any) {
    console.error('주문 생성 실패:', error);
    
    // if (error.response?.status === 422) {
    //   const errorMessage = error.response?.data?.message || '입력 데이터가 올바르지 않습니다.';
    //   toast.error(`검증 실패: ${errorMessage}`);
    // } else {
    //   toast.error('주문 생성에 실패했습니다.');
    // }
  }
};