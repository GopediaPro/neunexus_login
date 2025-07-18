import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";
import type { ExcelUploadRequest } from "@/shared/types";

export const postExcelToDb = async (data: ExcelUploadRequest) => {
  const response = await httpClient.post(`${API_END_POINT.DOWN_FORM_EXCEL_TO_DB}`, data);
  return response.data;
}