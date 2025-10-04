import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { ErpBulkUploadRequest, ExcelUploadResponse } from "../types/ecount.types";

export const postEcountErpUploadByExcel = async (
  file: File,
  requestData: ErpBulkUploadRequest
): Promise<ExcelUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  // API가 request: str = Body(...)로 JSON 문자열을 받도록 되어 있음
  formData.append('request', JSON.stringify(requestData));

  const response = await httpClient.post(API_END_POINT.ECOUNT_ERP_UPLOAD_BY_EXCEL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
