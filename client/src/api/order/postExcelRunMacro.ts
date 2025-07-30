import { API_END_POINT } from "@/constant/apiEndPoint";
import { httpClient } from "@/shared/axios";

interface ExcelUploadRequest {
  request: string;
  file: File;
}

export const postExcelRunMacro = async (data: ExcelUploadRequest) => {
  const formData = new FormData();

  formData.append('request', data.request);
  formData.append('file', data.file);


  const response = await httpClient.post(API_END_POINT.MACRO_EXCEL_RUN_MACRO, 
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