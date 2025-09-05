import { toast } from "sonner";

export const validateExcelFile = (file: File): string | null => {
  const allowedExtensions = ['.xlsx', '.xls'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(fileExtension)) {
    return '지원되지 않는 파일 형식입니다. (.xlsx, .xls만 가능)';
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return '파일 크기가 50MB를 초과합니다.';
  }

  return null;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ko-KR');
};

export const addFilesToList = (
  newFiles: FileList | File[], 
  existingFiles: any[], 
  validateFn: (file: File) => string | null = validateExcelFile
) => {
  const filesToAdd: any[] = [];
  
  Array.from(newFiles).forEach(file => {
    const validationError = validateFn(file);
    
    if (validationError) {
      toast.error(`${file.name}: ${validationError}`);
      return;
    }

    const isDuplicate = existingFiles.some(existingFile => 
      existingFile.name === file.name && existingFile.size === file.size
    );

    if (isDuplicate) {
      toast.warning(`${file.name}은 이미 추가된 파일입니다.`);
      return;
    }

    filesToAdd.push({
      id: Date.now() + Math.random().toString(),
      name: file.name,
      size: file.size,
      status: 'waiting',
      file: file
    });
  });

  return filesToAdd;
};