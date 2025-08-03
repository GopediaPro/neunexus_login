import { postProductRegistrationExcelImport } from "@/api/product/postProductRegistrationExcelImport";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface ImportResult {
  success: boolean;
  message: string;
  data?: any;
}

export const useProductImport = () => {
  const [isUploading, setIsUploading] = useState(false);

  const importMutation = useMutation({
    mutationFn: async ({ file, sheetName }: { file: File; sheetName: string }) => {
      return await postProductRegistrationExcelImport(file, sheetName);
    }
  });

  const handleFileImport = async (file: File, sheetName: string = '상품등록'): Promise<ImportResult> => {
    try {
      setIsUploading(true);
      
      if (!file) {
        return {
          success: false,
          message: '파일을 선택해주세요.',
        };
      }

      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          message: '엑셀 파일(.xls, .xlsx)만 업로드 가능합니다.',
        };
      }

      const result = await importMutation.mutateAsync({ file, sheetName });
      
      return {
        success: true,
        message: '상품 데이터가 성공적으로 업로드되었습니다.',
        data: result,
      };

    } catch (error: any) {
      let errorMessage = '업로드 중 오류가 발생했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = (onFileSelect: (file: File) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.multiple = false;
    
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    };
    
    input.click();
  };

  return {
    handleFileImport,
    triggerFileUpload,
    isUploading,
    isLoading: importMutation.isPending,
    error: importMutation.error,
  };
};