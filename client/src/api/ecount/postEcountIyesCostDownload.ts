import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";
import type { EcountDownloadRequest, EcountDownloadResponse } from "../types/ecount.types";

export const postEcountIyesCostDownload = async (req: EcountDownloadRequest): Promise<EcountDownloadResponse> => {
  const response = await httpClient.post(API_END_POINT.ECOUNT_IYES_COST_DOWNLOAD, req);
  return response.data;
};