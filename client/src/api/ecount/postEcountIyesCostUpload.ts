import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { EcountExcelImportRequest, EcountImportResponse } from "../types/ecount.types";

export const postEcountIyesCostUpload = async (
  file: File, 
  req: EcountExcelImportRequest
): Promise<EcountImportResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('request', JSON.stringify(req));

  const response = await httpClient.post(API_END_POINT.ECOUNT_IYES_COST_UPLOAD, formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response.data;
};