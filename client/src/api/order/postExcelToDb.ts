import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { ExcelToDbRequest, ExcelToDbResponse } from "../types";

export const postExcelToDb = async (data: ExcelToDbRequest): Promise<ExcelToDbResponse> => {
  const formData = new FormData();
  
  formData.append('request', data.request);
  formData.append('file', data.file);

  const response = await httpClient.post(
    API_END_POINT.DOWN_FORM_ORDERS_EXCEL_TO_DB,
    formData,
    {
      headers: {
        'Content-Type': undefined
      },
    }
  );
  
  return response.data;
};