import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { templateOptions } from "@/constant";
import { useState, type ChangeEvent } from "react";
import { Button } from "../Button";
import { postExcelUpload } from "@/api/order/postExcelUpload";
import { Controller, useForm } from "react-hook-form";
import type { ExcelUploadRequest } from "@/shared/types";
import { Modal } from ".";
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from "./ModalLayout";

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ExcelUploadModal = ({ isOpen, onClose, onSuccess }: ExcelUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExcelUploadRequest>({
    defaultValues: {
      template_code: '',
      file: null
    }
  });

  const templateCode = watch('template_code');

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

  const handleFormSubmit = async (data: ExcelUploadRequest) => {
    if (!data.template_code) return;
    if (!selectedFile) return;
    console.log(data);

    setIsUploading(true);

    try {
      await postExcelUpload({
        template_code: data.template_code,
        file: selectedFile
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <ModalTitle>엑셀 업로드</ModalTitle>
      </ModalHeader>

      <ModalBody className="h-[400px]">
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
          onClick={handleSubmit(handleFormSubmit)}
          disabled={!templateCode || !selectedFile || isUploading}
        >
          {isUploading ? '업로드 중...' : '업로드'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}