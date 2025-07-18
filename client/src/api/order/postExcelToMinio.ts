import { API_END_POINT } from "@/constant";
import { httpClient } from "@/shared/axios";

interface ExcelUploadRequest {
  template_code: string;
  file: File;
}

interface ExcelUploadResponse {
  file_url: string;
  object_name: string;
  template_code: string;
}

export const postExcelToMinio =  async (data: ExcelUploadRequest) => {
  const formData = new FormData();

  formData.append('template_code', data.template_code);
  formData.append('file', data.file);

  const response = await httpClient.post<ExcelUploadResponse>(
    API_END_POINT.DOWN_FORM_EXCEL_TO_MINIO, 
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