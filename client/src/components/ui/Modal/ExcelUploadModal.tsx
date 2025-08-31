import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { templateOptions } from "@/constant";
import { useState, type ChangeEvent } from "react";
import { Button } from "../Button";
import { useForm } from "react-hook-form";
import { Modal } from "../ModalComponent";
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from "../ModalComponent/ModalLayout";
import { ResultModal } from "./BulkResultModal";
import { FormField } from "../FormField";
import { modalConfig } from "@/constant/order"
import type { ExcelUploadFormData } from "@/api/types";
import { postExcelRunMacro } from "@/api/order/postExcelRunMacro";

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'minio' | 'database' | 'macro';
  createdBy?: string;
}

export const ExcelUploadModal = ({ isOpen, onClose, onSuccess, mode = 'macro', createdBy }: ExcelUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    url?: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExcelUploadFormData>({
    defaultValues: {
      template_code: '',
      order_date_from: '',
      order_date_to: '',
      source_table: 'receive_orders',
      file: null
    }
  });

  const watchedValues = watch();
  const config = modalConfig[mode as keyof typeof modalConfig] || {
    submitText: mode === 'macro' ? '매크로 실행' : '업로드',
    loadingText: mode === 'macro' ? '매크로 실행 중...' : '업로드 중...',
    successTitle: mode === 'macro' ? '매크로 실행 완료' : '업로드 완료',
    requiresDates: mode === 'minio' || mode === 'database'
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      setUploadResult({
        type: 'error',
        title: '파일 형식 오류',
        message: '지원되지 않는 파일 형식입니다.\n.xlsx 또는 .xls 파일만 업로드 가능합니다.'
      });
      setShowResultModal(true);
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadResult({
        type: 'error',
        title: '파일 크기 초과',
        message: '파일 크기가 10MB를 초과합니다.\n더 작은 파일을 선택해주세요.'
      });
      setShowResultModal(true);
      return;
    }

    setSelectedFile(file);
    setValue('file', file);
  }

  const handleFormSubmit = async (data: ExcelUploadFormData) => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      if (mode === 'macro') {
        if (!data.template_code || !data.file) return;
        const todayString = new Date().toISOString().split('T')[0];
        
        const requestData = {
          template_code: data.template_code,
          file: selectedFile,
          created_by: createdBy,
          filters: {
            order_date_from: todayString,
            order_date_to: todayString
          },
          source_table: "receive_orders"
        };

        const response = await postExcelRunMacro({
          request: JSON.stringify(requestData),
          file: data.file
        });

        setUploadResult({
          type: 'success',
          title: '매크로 실행 완료',
          message: `엑셀 매크로가 성공적으로 실행되었습니다.\n\n파일명: ${selectedFile.name}\n실행 시간: ${new Date().toLocaleString('ko-KR')}`,
          url: response.file_url
        });
      }
      setShowResultModal(true);
      onSuccess?.();
    } catch (error: any) {
      console.error(error);

      let errorTitle = '';
      let errorMessage = '';

      switch (mode) {
        case 'minio':
          errorTitle = '업로드 실패';
          errorMessage = '파일 업로드에 실패했습니다.';
          break;
        case 'database':
          errorTitle = 'DB 저장 실패';
          errorMessage = 'DB 저장에 실패했습니다.';
          break;
        case 'macro':
          errorTitle = '매크로 실행 실패';
          errorMessage = '엑셀 매크로 실행에 실패했습니다.';
          break;
        default:
          errorTitle = '처리 실패';
          errorMessage = '요청 처리에 실패했습니다.';
      }

      setUploadResult({
        type: 'error',
        title: errorTitle,
        message: `${errorMessage}\n\n오류 내용: ${error.message || '알 수 없는 오류가 발생했습니다.'}\n\n다시 시도해주세요.`
      });
      setShowResultModal(true);
    } finally {
      setIsUploading(false);
    }
  }

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setUploadResult(null);
    onClose();
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    if (uploadResult?.type === 'success') {
      handleClose();
    }
    setUploadResult(null);
  }

  const isFormValid = () => {
    switch (mode) {
      case 'minio':
      case 'macro':
        return watchedValues.template_code && 
               watchedValues.order_date_from && 
               watchedValues.order_date_to && 
               selectedFile;
      case 'database':
        return watchedValues.template_code && selectedFile;
      default:
        return false;
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'minio':
        return '엑셀 업로드';
      case 'database':
        return 'DB 저장';
      case 'macro':
        return '엑셀 매크로 실행';
      default:
        return '엑셀 처리';
    }
  };

  const getFileDescription = () => {
    switch (mode) {
      case 'minio':
        return '파일을 Minio 스토리지에 업로드합니다.';
      case 'database':
        return '엑셀 데이터를 직접 데이터베이스에 저장합니다.';
      case 'macro':
        return '엑셀 파일에 매크로를 실행하여 처리합니다.';
      default:
        return '파일을 처리합니다.';
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalHeader>
          <ModalTitle>{getModalTitle()}</ModalTitle>
        </ModalHeader>

        <ModalBody className="h-[500px]">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormField
                name="template_code"
                label="템플릿 선택"
                control={control}
                render={(field) => (
                    <SelectSearchInput
                      options={templateOptions}
                      value={field.value as string}
                      onChange={field.onChange}
                      placeholder="템플릿을 선택하세요"
                    />
                )}
                error={errors.template_code?.message}
              />
            </div>

            <div className="space-y-2">
              <FormField
                name="file"
                control={control}
                label="Excel 파일"
                render={() => (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="sr-only"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="
                          w-full
                          flex items-center justify-between
                          p-3
                          border border-stroke-base-100
                          rounded-md
                          bg-fill-base-100 hover:bg-fill-base-200
                          cursor-pointer
                          transition-colors duration-200
                          focus-within:ring-2 focus-within:ring-stroke-base-100 focus-within:border-stroke-base-100
                        "
                      >
                        <span className="text-text-base-400">
                          {selectedFile ? selectedFile.name : '파일을 선택하세요'}
                        </span>
                        <span className="
                          px-3 py-1
                          bg-fill-base-100 hover:bg-fill-base-200
                          border border-stroke-base-100
                          rounded
                          text-body-l text-text-base-500
                          transition-colors duration-200
                        ">
                          파일 선택
                        </span>
                      </label>
                    </div>
                    {selectedFile && (
                      <p className="text-body-s text-text-base-500">
                        {getFileDescription()}
                      </p>
                    )}
                  </div>
                )}
                error={errors.file?.message}
              />
            </div>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="light"
            onClick={handleClose}
            disabled={isUploading}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={!isFormValid || isUploading}
          >
            {isUploading ? config.loadingText : config.submitText}
          </Button>
        </ModalFooter>
      </Modal>

      {uploadResult && (
        <ResultModal
          isOpen={showResultModal}
          onClose={handleResultModalClose}
          type={uploadResult.type}
          title={uploadResult.title}
          message={uploadResult.message}
          url={uploadResult.url}
          urlLabel="다운로드 링크"
        />
      )}
    </>
  )
}