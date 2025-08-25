import { API_END_POINT } from "../apiEndPoint";
import { httpClient } from "../axios";

interface SmileMacroUploadRequest {
  request: string;
  files: File[];
}

export interface SmileMacroV2Response {
  batch_id: string;
  processed_count: number;
  a_file_url: string;
  g_file_url: string;
}

export interface StandardResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const postSmileMacroMultiple = async (data: SmileMacroUploadRequest): Promise<StandardResponse<SmileMacroV2Response>> => {
  const formData = new FormData();

  formData.append('request', data.request);
  data.files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await httpClient.post(
    API_END_POINT.SMILE_MACRO_MULTIPLE_V2,
    formData,
    {
      headers: {
        'Content-Type': undefined
      },
      timeout: 60000
    }
  );
  
  return response.data;
};