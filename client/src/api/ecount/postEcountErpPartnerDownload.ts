import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { EcountDownloadRequest, EcountDownloadResponse } from "../types/ecount.types";

export const postEcountErpPartnerDownload = async (req: EcountDownloadRequest): Promise<EcountDownloadResponse> => {
  const response = await httpClient.post(API_END_POINT.ECOUNT_ERP_PARTNER_CODE_DOWNLOAD, req);
  return response.data;
};