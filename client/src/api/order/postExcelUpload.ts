import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

interface ExcelUploadRequest {
  request: string;
  file: File;
}

interface ExcelUploadResponse {
  file_url: string;
  object_name: string;
  template_code: string;
}

export const postExcelUpload =  async (data: ExcelUploadRequest) => {
  const formData = new FormData();

  formData.append('request', data.request);
  formData.append('file', data.file);

  const response = await httpClient.post<ExcelUploadResponse>(
    API_END_POINT.DOWN_FORM_EXCEL_UPLOAD, 
    formData,
    {
      headers: {
        'Content-Type': undefined
      },
      timeout: 30000
    }
  );
  return response.data;
};