import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { EcountAllDataImportRequest, EcountImportResponse } from "../types/ecount.types";

export const postEcountAllDataUpload = async (
  file: File, 
  req: EcountAllDataImportRequest
): Promise<EcountImportResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('request', JSON.stringify(req));

  const response = await httpClient.post(API_END_POINT.ECOUNT_ALL_DATA_UPLOAD, formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response.data;
};