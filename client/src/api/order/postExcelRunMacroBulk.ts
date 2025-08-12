import { API_END_POINT } from "@/constant/apiEndPoint";
import { httpClient } from "@/api/axios";

interface ExcelUploadRequest {
  request: string;
  files: File[];
}

export const postExcelRunMacroBulk = async (data: ExcelUploadRequest) => {
  const formData = new FormData();

  formData.append('request', data.request);
  data.files.forEach((file) => {
    formData.append('files', file);
  });


  const response = await httpClient.post(API_END_POINT.MACRO_EXCEL_RUN_MACRO_BULK, 
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