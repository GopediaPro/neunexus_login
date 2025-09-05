import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { DbToExcelRequest, DbToExcelResponse } from "../types";

export const postDbToExcel = async (requestData: DbToExcelRequest): Promise<DbToExcelResponse> => {
  const response = await httpClient.post(
    API_END_POINT.DOWN_FORM_ORDERS_DB_TO_EXCEL_URL,
    requestData
  );
  
  return response.data;
};