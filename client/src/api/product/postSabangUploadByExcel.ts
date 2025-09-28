import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { SabangUploadRequest, SabangUploadResponse } from "../types/product.types";
import type { MallConfigs } from "@/constants/mallConfig";

export const createSabangUploadRequest = (
  sheetName: string,
  userId: string,
  mallConfigs?: MallConfigs | null
): SabangUploadRequest => {
  const requestData: SabangUploadRequest = {
    data: {
      sheet_name: sheetName,
      enable_mall_value_setting: true
    },
    metadata: {
      // request_id: `sabang-upload-${Date.now()}-${userId}`
      request_id: `${userId}`
    }
  };

  // MallConfigs가 있을 경우만 mall_configs 추가
  if (mallConfigs) {
    requestData.data.mall_configs = {};
    Object.entries(mallConfigs).forEach(([mallCode, config]) => {
      if (config.discountRate > 0) {
        requestData.data.mall_configs![mallCode] = {
          discount_rate: config.discountRate
        };
      }
    });
  }

  return requestData;
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
