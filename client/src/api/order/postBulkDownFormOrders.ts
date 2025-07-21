import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";
import type { BulkCreateRequest } from "@/shared/types";

export const postBulkDownFormOrders = async (req: BulkCreateRequest) => {
  try {
    const response = await httpClient.post(API_END_POINT.DOWN_FORM_ORDERS_BULK_CREATE, req);
    return response.data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || '주문 대량 생성에 실패했습니다.',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
  }
};