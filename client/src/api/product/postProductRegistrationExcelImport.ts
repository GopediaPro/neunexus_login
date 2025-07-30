import { API_END_POINT } from "@/constant/apiEndPoint";
import { httpClient } from "@/shared/axios";

export const postProductRegistrationExcelImport = async (file: File, sheetName: string) => {
  const formData = new FormData();
  formData.append('sheet_name', sheetName);
  formData.append('file', file);

  const response = await httpClient.post(API_END_POINT.PRODUCT_REGISTRATION_EXCEL_IMPORT, formData,
    {
      headers: {
        'Content-Type': undefined
      },
      timeout: 30000
    }
  );
  return response.data;
};