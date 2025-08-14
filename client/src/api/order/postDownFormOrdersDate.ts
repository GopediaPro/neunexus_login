import { API_END_POINT } from "@/constant";
import { httpClient } from "@/api/axios";
// 미사용
export const postDownFormOrdersDate = async (req: { start_date: string, end_date: string }) => {
  const response = await httpClient.post(API_END_POINT.DOWN_FORM_ODDERS_PAGINATION_DATE_RANGE, req);
  return response.data;
};