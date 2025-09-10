import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { ErpTransferRequest, ErpTransferResponse } from "../types/ecount.types";

export const postEcountErpDownload = async (req: ErpTransferRequest): Promise<ErpTransferResponse> => {
  const response = await httpClient.post(API_END_POINT.ECOUNT_ERP_TRANSFER_DOWNLOAD, req);
  return response.data;
};