import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { templateOptions } from "@/constant";
import { useState, type ChangeEvent } from "react";
import { Button } from "../Button";
import { postExcelUpload } from "@/api/order/postExcelUpload";
import { useForm } from "react-hook-form";
import type { ExcelUploadFormData } from "@/shared/types";
import { Modal } from ".";
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from "./ModalLayout";
import { ResultModal } from "./ResultModal";
import { FormField } from "../FormField";
import { Input } from "../input";

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  createdBy: string;
}

export const ExcelUploadModal = ({ isOpen, onClose, onSuccess, createdBy }: ExcelUploadModalProps) => {
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
    if (!data.template_code || !data.file || !data.order_date_from || !data.order_date_to) return;
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const requestData = {
        template_code: data.template_code,
        created_by: createdBy,
        filters: {
          order_date_from: data.order_date_from,
          order_date_to: data.order_date_to
        },
        source_table: data.source_table
      };
      
      const response = await postExcelUpload({
        request: JSON.stringify(requestData),
        file: data.file
      });

      setUploadResult({
        type: 'success',
        title: '업로드 완료',
        message: `엑셀 파일이 성공적으로 업로드되었습니다.\n\n파일명: ${selectedFile.name}\n업로드 시간: ${new Date().toLocaleString('ko-KR')}`,
        url: response.file_url || response.file_url
      });
      setShowResultModal(true);

      onSuccess?.();
    } catch (error: any) {
      console.error(error);

      setUploadResult({
        type: 'error',
        title: '업로드 실패',
        message: `파일 업로드에 실패했습니다.\n\n오류 내용: ${error.message || '알 수 없는 오류가 발생했습니다.'}\n\n다시 시도해주세요.`
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

  const isFormValid = 
    watchedValues.template_code && 
    watchedValues.order_date_from && 
    watchedValues.order_date_to && 
    selectedFile;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalHeader>
          <ModalTitle>엑셀 업로드</ModalTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
              <FormField
                name="order_date_from"
                label="시작 날짜"
                control={control}
                render={(field) => (
                  <Input
                    id="시작 날짜"
                    type="date"
                    className="bg-fill-base-100"
                    {...field}
                    value={field.value as string}
                  />
                )}
                error={errors.order_date_from?.message}
              />
              </div>

              <div className="space-y-2">
                <FormField
                  name="order_date_to"
                  label="종료 날짜"
                  control={control}
                  render={(field) => (
                    <Input
                      id="종료 날짜"
                      type="date"
                      className="bg-fill-base-100"
                      {...field}
                      value={field.value as string}
                    />
                  )}
                  error={errors.order_date_to?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                name="source_table"
                label="소스 테이블"
                control={control}
                render={(field) => (
                  <Input
                    id="소스 테이블"
                    type="text"
                    placeholder="receive_orders"
                    className="bg-fill-base-100"
                    {...field}
                    value={field.value as string}
                  />
                )}
                error={errors.source_table?.message}
              />
            </div>

            <div className="space-y-2">
              <FormField
                name="file"
                control={control}
                label="Excel 파일"
                render={() => (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="w-full p-3 border border-stroke-base-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {selectedFile && (
                      <p className="text-body-s text-gray-600">
                        선택된 파일: {selectedFile.name}
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
            {isUploading ? '업로드 중...' : '업로드'}
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