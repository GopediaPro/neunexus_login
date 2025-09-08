import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { addFilesToList, validateExcelFile } from '@/utils/fileUtils';

interface FileItem {
  id: string;
  name: string;
  size: number;
  status: 'waiting' | 'uploading' | 'completed' | 'error';
  progress?: number;
  uploadTime?: string;
  file?: File;
}

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | File[]) => {
    const filesToAdd = addFilesToList(newFiles, files, validateExcelFile);
    
    if (filesToAdd.length > 0) {
      setFiles(prev => [...prev, ...filesToAdd]);
      toast.success(`${filesToAdd.length}개 파일이 추가되었습니다.`);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    toast.info('파일이 삭제되었습니다.');
  };

  const resetFiles = () => {
    setFiles([]);
    setSelectedFiles([]);
  };

  const updateFileStatus = (
    fileId: string, 
    status: FileItem['status'], 
    progress?: number
  ) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            status, 
            progress,
            uploadTime: status === 'completed' ? new Date().toLocaleString('ko-KR') : file.uploadTime
          }
        : file
    ));
  };

  return {
    files,
    selectedFiles,
    isUploading,
    fileInputRef,
    setFiles,
    setSelectedFiles,
    setIsUploading,
    addFiles,
    removeFile,
    resetFiles,
    updateFileStatus
  };
};
