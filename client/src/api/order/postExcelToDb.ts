import { API_END_POINT } from "@/constant";
import { httpClient } from "@/api/axios";
import type { SimpleExcelUploadRequest, ExcelUploadResponse } from "@/api/types";

export const postExcelToDb = async (data: SimpleExcelUploadRequest) => {
  const formData = new FormData();

  formData.append('template_code', data.template_code);
  formData.append('file', data.file);

  const response = await httpClient.post<ExcelUploadResponse>(
    API_END_POINT.DOWN_FORM_EXCEL_TO_DB, 
    formData,
    {
      headers: {
        'Content-Type': undefined
      },
      timeout: 30000
    }
  );
  return response.data;
}