import { API_END_POINT } from "@/constant/apiEndPoint";
import { httpClient } from "@/shared/axios";

export const postProductRegistrationExcelImport = async (file: File, sheetName: string) => {
  const formData = new FormData();
  formData.append('file', file);

  const params = new URLSearchParams({
    sheet_name: sheetName
  });

  const response = await httpClient.post(`${API_END_POINT.PRODUCT_REGISTRATION_EXCEL_IMPORT}?${params.toString()}`, formData,
    {
      headers: {
        'Content-Type': undefined
      },
      timeout: 80000
    }
  );
  return response.data;
};