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

export const postExcelUpload =  async (data: ExcelUploadRequest) => {
  const formData = new FormData();
  formData.append('template_code', data.template_code);
  formData.append('file', data.file);

  const multipartClient = httpClient.create({
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
  });

  const res = await multipartClient.post<ExcelUploadResponse>(
    API_END_POINT.DOWN_FORM_EXCEL_UPLOAD, formData
  )

  return res.data;
};