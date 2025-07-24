import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

export const getDownFormOrders = async ({
  skip = 0,
  limit = 200,
}: {
  skip?: number;
  limit?: number;
}) => {
  const params: Record<string, any> = {
    skip,
    limit
  };

  const response = await httpClient.get(API_END_POINT.DOWN_FORM_ORDERS, { params });
  return response.data;
};