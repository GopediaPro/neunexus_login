import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { templateOptions } from "@/constant";
import { useState, type ChangeEvent } from "react";
import { Button } from "../Button";
import { postExcelUpload } from "@/api/order/postExcelUpload";
import { Controller, useForm } from "react-hook-form";
import type { ExcelUploadFormData } from "@/shared/types";
import { Modal } from ".";
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from "./ModalLayout";

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  createdBy: string;
}

export const ExcelUploadModal = ({ isOpen, onClose, onSuccess, createdBy }: ExcelUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
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
      
      await postExcelUpload({
        request: JSON.stringify(requestData),
        file: data.file
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    onClose();
  }

  const isFormValid = 
    watchedValues.template_code && 
    watchedValues.order_date_from && 
    watchedValues.order_date_to && 
    selectedFile;


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <ModalTitle>엑셀 업로드</ModalTitle>
      </ModalHeader>

      <ModalBody className="h-[500px]">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-caption text-text-base-500">
              템플릿 선택 <span className="text-error-base-500">*</span>
            </label>
            <Controller
              name="template_code"
              control={control}
              rules={{ required: '템플릿을 선택해주세요' }}
              render={({ field }) => (
                <SelectSearchInput
                  options={templateOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="템플릿을 선택하세요"
                />
              )}
            />
            {errors.template_code && (
              <p className="text-sm text-error-500">{errors.template_code.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-caption text-text-base-500">
                시작 날짜 <span className="text-error-base-500">*</span>
              </label>
              <Controller
                name="order_date_from"
                control={control}
                rules={{ required: '시작 날짜를 선택해주세요' }}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className="w-full p-3 border border-stroke-base-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.order_date_from && (
                <p className="text-sm text-error-500">{errors.order_date_from.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-caption text-text-base-500">
                종료 날짜 <span className="text-error-base-500">*</span>
              </label>
              <Controller
                name="order_date_to"
                control={control}
                rules={{ required: '종료 날짜를 선택해주세요' }}
                render={({ field }) => (
                  <input
                    type="date"
                    {...field}
                    className="w-full p-3 border border-stroke-base-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.order_date_to && (
                <p className="text-sm text-error-500">{errors.order_date_to.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-caption text-text-base-500">
              소스 테이블 <span className="text-error-base-500">*</span>
            </label>
            <Controller
              name="source_table"
              control={control}
              rules={{ required: '소스 테이블을 입력해주세요' }}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className="w-full p-3 border border-stroke-base-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="receive_orders"
                />
              )}
            />
            {errors.source_table && (
              <p className="text-sm text-error-500">{errors.source_table.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-caption text-text-base-500">
              Excel 파일 <span className="text-error-500">*</span>
            </label>
            <Controller
              name="file"
              control={control}
              rules={{ required: '파일을 선택해주세요' }}
              render={() => (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-stroke-base-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600">
                      선택된 파일: {selectedFile.name}
                    </p>
                  )}
                </div>
              )}
            />
            {errors.file && (
              <p className="text-sm text-error-500">{errors.file.message}</p>
            )}
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
  )
}