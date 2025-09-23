import { type UseMutationResult } from "@tanstack/react-query";
import type { BulkCreateOrderItem, BulkCreateRequest, DownFormBulkCreateResponse } from "@/api/types";
import type { GridApi } from "ag-grid-community";
import { ORDER_DEFAULTS } from "@/constants/order";
import { handleOrderError } from "@/utils/errorHandler";
import { confirmOrderCreation, processCreateResult, validateOrderCreation, validateOrderIds } from "@/utils/orderValidation";


export const handleOrderCreate = async (
  gridApi: GridApi, 
  bulkCreateMutation: UseMutationResult<DownFormBulkCreateResponse, Error, BulkCreateRequest>,
  currentTemplate: string = "gmarket_erp"
) => {  
  const validation = validateOrderCreation(gridApi);
  if(!validation.isValid) return;

  const { selectedRows } = validation;
  
  const idValidation = validateOrderIds(selectedRows);
  if (!idValidation.isValid) return;

  if (!confirmOrderCreation(selectedRows)) return;

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
          sale_cnt: row.sale_cnt ? Number(row.sale_cnt) : ORDER_DEFAULTS.SALE_COUNT,
          pay_cost: row.pay_cost ? Number(row.pay_cost) : ORDER_DEFAULTS.PAY_COST,
          delv_cost: row.delv_cost ? Number(row.delv_cost) : ORDER_DEFAULTS.DELIVERY_COST,
          total_cost: row.total_cost ? Number(row.total_cost) : ORDER_DEFAULTS.TOTAL_COST,
          total_delv_cost: row.total_delv_cost ? Number(row.total_delv_cost) : ORDER_DEFAULTS.TOTAL_COST,
          expected_payout: row.expected_payout ? Number(row.expected_payout) : ORDER_DEFAULTS.EXPECTED_PAYOUT,
          etc_cost: row.etc_cost || ORDER_DEFAULTS.TOTAL_COST,
          price_formula: row.price_formula || ORDER_DEFAULTS.PRICE_FORMULA,
          service_fee: row.service_fee ? Number(row.service_fee) : ORDER_DEFAULTS.SERVICE_FEE,
          sum_p_ea: row.sum_p_ea ? Number(row.sum_p_ea) : ORDER_DEFAULTS.SALE_COUNT,
          sum_expected_payout: row.sum_expected_payout ? Number(row.sum_expected_payout) : ORDER_DEFAULTS.EXPECTED_PAYOUT,
          sum_pay_cost: row.sum_pay_cost ? Number(row.sum_pay_cost) : ORDER_DEFAULTS.PAY_COST,
          sum_delv_cost: row.sum_delv_cost ? Number(row.sum_delv_cost) : ORDER_DEFAULTS.DELIVERY_COST,
          sum_total_cost: row.sum_total_cost ? Number(row.sum_total_cost) : ORDER_DEFAULTS.TOTAL_COST,
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

    processCreateResult(response, selectedRows, gridApi);
  } catch (error: any) {
    handleOrderError(error, '생성');
  }
};