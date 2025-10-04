import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { ErpTransferRequest, ErpTransferResponse } from "../types/ecount.types";

export const postEcountErpDownload = async (req: ErpTransferRequest): Promise<ErpTransferResponse> => {
  // ERP transfer download는 처리 시간이 길어서 타임아웃을 60초로 설정
  const response = await httpClient.post(API_END_POINT.ECOUNT_ERP_TRANSFER_DOWNLOAD, req, {
    timeout: 120000 // 120초
  });
  
  // HTTP 상태 코드가 200이고 응답 데이터가 있으면 성공으로 처리
  if (response.status === 200 && response.data) {
    return {
      success: true,
      ...response.data
    };
  }
  
  return response.data;
};