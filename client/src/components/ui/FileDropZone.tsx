import { useState } from 'react';
import { createDragDropHandlers } from '@/utils/dragDropUtils';
import { Button } from './Button';

interface FileDropZoneProps {
  onFilesAdded: (files: FileList) => void;
  accept?: string;
  maxSize?: string;
  isUploading?: boolean;
  multiple?: boolean;
}

export const FileDropZone = ({
  onFilesAdded,
  accept = '.xlsx,.xls',
  maxSize = '50MB',
  isUploading = false,
  multiple = true
}: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const { handleDragEnter, handleDragLeave, handleDragOver, handleDrop } = 
    createDragDropHandlers(setIsDragging, onFilesAdded);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFilesAdded(files);
      }
    };
    input.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors cursor-pointer ${
        isDragging 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-stroke-base-200 bg-fill-base-50 hover:bg-fill-base-100'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleFileSelect}
    >
      <div className="flex flex-col items-center space-y-4">
        <div>
          <h3 className="text-h3 text-text-base-700 mb-2">
            Excel 파일을 업로드하세요
          </h3>
          <p className="text-body-l text-text-base-500 mb-4">
            {accept} 형식의 파일을 업로드 할 수 있습니다. (최대 {maxSize})
          </p>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect();
            }}
            className="px-5 py-1 bg-stroke-base-100 text-text-base-500 text-body-l hover:bg-stroke-base-200"
            disabled={isUploading}
          >
            파일 선택
          </Button>
        </div>
      </div>
    </div>
  );
};