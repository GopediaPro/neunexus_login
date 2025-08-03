import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";
import type { BulkCreateRequest } from "@/shared/types";

export const postBulkDownFormOrders = async (req: BulkCreateRequest) => {
    const response = await httpClient.post(API_END_POINT.DOWN_FORM_ORDERS_BULK_CREATE, req);
    return response.data;
};