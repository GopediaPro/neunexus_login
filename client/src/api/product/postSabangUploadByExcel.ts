import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { SabangUploadRequest, SabangUploadResponse } from "../types/product.types";

export const createSabangUploadRequest = (
  sheetName: string,
  userId: string
): SabangUploadRequest => {
  return {
    data: {
      sheet_name: sheetName
    },
    metadata: {
      // request_id: `sabang-upload-${Date.now()}-${userId}`
      request_id: `${userId}`
    }
  };
};

export const postSabangUploadByExcel = async (
  file: File,
  requestData: SabangUploadRequest
): Promise<SabangUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('request', JSON.stringify(requestData));

  const response = await httpClient.post(API_END_POINT.PRODUCT_SABANG_UPLOAD_BY_EXCEL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
