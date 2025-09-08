import { API_END_POINT } from "@/api/apiEndPoint";
import { httpClient } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

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

  export const useProductImport = () => {
    return useMutation({
  mutationFn: async ({ file, sheetName }: { file: File; sheetName: string }) => {
    return await postProductRegistrationExcelImport(file, sheetName);
  }
});
};