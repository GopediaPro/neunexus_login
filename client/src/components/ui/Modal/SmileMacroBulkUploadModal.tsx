import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Modal } from "../ModalComponent";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { toast } from "sonner";
import { BulkResultModal } from "./ResultBulkModal";
import { postSmileMacroMultiple } from "@/api/order/postSmileMacro";

interface FileItem {
  id: string;
  name: string;
  size: number;
  status: 'waiting' | 'uploading' | 'completed' | 'error';
  progress?: number;
  uploadTime?: string;
  file?: File;
}

interface FileResult {
  name: string;
  url?: string;
  status: 'success' | 'error';
}

const createSmileMacroRequest = (
  orderDateFrom: string,
  orderDateTo: string,
  requestId?: string
) => {
  return {
    data: {
      order_date_from: orderDateFrom,
      order_date_to: orderDateTo
    },
    metadata: {
      request_id: requestId || `smile_macro_${Date.now()}`
    }
  };
};

export const SmileMacroBulkUploadModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [orderDateFrom, setOrderDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [orderDateTo, setOrderDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [bulkResult, setBulkResult] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    fileResults: FileResult[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
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

  const addFiles = (newFiles: FileList | File[]) => {
    const filesToAdd: FileItem[] = [];
    
    Array.from(newFiles).forEach(file => {
      const validationError = validateFile(file);
      
      if (validationError) {
        toast.error(`${file.name}: ${validationError}`);
        return;
      }

      const isDuplicate = files.some(existingFile => 
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

    if (filesToAdd.length > 0) {
      setFiles(prev => [...prev, ...filesToAdd]);
      toast.success(`${filesToAdd.length}개 파일이 추가되었습니다.`);
    }
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  };

  const handleFileSelectButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    toast.info('파일이 삭제되었습니다.');
  };

  const handleFileCheck = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const simulateProgressUpdate = (fileIds: string[]) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => 
        fileIds.includes(f.id) && f.status === 'uploading'
          ? { ...f, progress: Math.min((f.progress || 0) + Math.random() * 15, 95) }
          : f
      ));
    }, 300);

    return interval;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allFileIds = files.map(file => file.id);
      setSelectedFiles(allFileIds);
      toast.info(`전체 ${files.length}개 파일이 선택되었습니다.`);
    } else {
      setSelectedFiles([]);
      toast.info('전체 선택이 해제되었습니다.');
    }
  };

  const handleStartUpload = async () => {
    const filesToUpload = files.filter(file => file.status === 'waiting');

    if (filesToUpload.length === 0) {
      toast.warning('업로드할 파일이 없습니다.');
      return;
    }

    if (!orderDateFrom || !orderDateTo) {
      toast.error('주문 날짜를 설정해주세요.');
      return;
    }

    if (new Date(orderDateFrom) > new Date(orderDateTo)) {
      toast.error('시작 날짜는 종료 날짜보다 이전이어야 합니다.');
      return;
    }

    setIsUploading(true);

    setFiles(prev => prev.map(file => 
      filesToUpload.some(f => f.id === file.id)
        ? { ...file, status: 'uploading', progress: 0 }
        : file
    ));

    const fileIds = filesToUpload.map(f => f.id);
    const progressInterval = simulateProgressUpdate(fileIds);

    try {
      const fileObjects = filesToUpload.map(fileItem => fileItem.file).filter((file): file is File => file !== undefined);
      const requestId = `smile_macro_${Date.now()}`;

      const requestData = createSmileMacroRequest(orderDateFrom, orderDateTo, requestId);
      const response = await postSmileMacroMultiple({
        request: JSON.stringify(requestData),
        files: fileObjects
      });
      
      clearInterval(progressInterval);

      if (response.success) {
        const fileResults: FileResult[] = filesToUpload.map(file => ({
          name: file.name,
          status: 'success' as const,
          url: response.data.a_file_url
        }));

        setFiles(prev => prev.map(file => 
          filesToUpload.some(f => f.id === file.id)
            ? { 
                ...file, 
                status: 'completed', 
                progress: 100, 
                uploadTime: new Date().toLocaleString('ko-KR')
              }
            : file
        ));

        setBulkResult({
          type: 'success',
          title: 'Smile Macro 처리 완료',
          message: `배치 ID: ${response.data.batch_id}\n처리된 건수: ${response.data.processed_count}건\n처리 시간: ${new Date().toLocaleString('ko-KR')}\n\nA파일: ${response.data.a_file_url}\nG파일: ${response.data.g_file_url}`,
          fileResults
        });

        setShowResultModal(true);
        toast.success(`${filesToUpload.length}개 파일 처리가 완료되었습니다.`);
      } else {
        throw new Error(response.message || '처리 실패');
      }
    } catch (error) {
      clearInterval(progressInterval);

      const fileResults: FileResult[] = filesToUpload.map(file => ({
        name: file.name,
        status: 'error' as const,
      }));

      setFiles(prev => prev.map(file => 
        filesToUpload.some(f => f.id === file.id)
          ? { ...file, status: 'error', progress: 0 }
          : file
      ));

      setBulkResult({
        type: 'error',
        title: 'Smile Macro 처리 실패',
        message: `파일 처리 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`,
        fileResults
      });

      setShowResultModal(true);
      toast.error('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: FileItem['status']) => {
    switch (status) {
      case 'uploading':
        return <Icon name="loading" style="w-4 h-4 text-primary-500 animate-spin" />;
      case 'completed':
        return <Icon name="check" style="w-4 h-4 text-primary-500" />;
      case 'error':
        return <Icon name="alert" style="w-4 h-4 text-rose-500" />;
      default:
        return <Icon name="document" style="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (file: FileItem) => {
    switch (file.status) {
      case 'uploading':
        return 'Processing...';
      case 'completed':
        return file.uploadTime;
      case 'error':
        return 'Processing failed';
      default:
        return 'Waiting...';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClose = () => {
    setFiles([]);
    setSelectedFiles([]);
    setBulkResult(null);
    setOrderDateFrom(new Date().toISOString().split('T')[0]);
    setOrderDateTo(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    if (bulkResult?.type === 'success') {
      handleClose();
    }
    setBulkResult(null);
  };

  const waitingFiles = files.filter(f => f.status === 'waiting');
  const isAllSelected = files.length > 0 && selectedFiles.length === files.length;
  const isPartiallySelected = selectedFiles.length > 0 && selectedFiles.length < files.length;

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
        <Modal.Header>
          <Modal.Title>Smile Macro 대량 처리</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body className="h-[700px] flex flex-col">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="mb-6 p-4 border border-stroke-base-200 rounded-lg bg-fill-base-50">
            <h3 className="text-h4 text-text-base-700 mb-3">주문 날짜 설정</h3>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col">
                <label className="text-body-s text-text-base-600 mb-1">시작 날짜</label>
                <input
                  type="date"
                  value={orderDateFrom}
                  onChange={(e) => setOrderDateFrom(e.target.value)}
                  className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
                  disabled={isUploading}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-body-s text-text-base-600 mb-1">종료 날짜</label>
                <input
                  type="date"
                  value={orderDateTo}
                  onChange={(e) => setOrderDateTo(e.target.value)}
                  className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
                  disabled={isUploading}
                />
              </div>
            </div>
          </div>

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
            onClick={handleFileSelectButton}
          >
            <div className="flex flex-col items-center space-y-4">
              <div>
                <h3 className="text-h3 text-text-base-700 mb-2">
                  Excel 파일을 업로드하세요
                </h3>
                <p className="text-body-l text-text-base-500 mb-4">
                  .xlsx, .xls 형식의 파일을 업로드 할 수 있습니다. (최대 50MB)
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelectButton();
                  }}
                  className="px-5 py-1 bg-stroke-base-100 text-text-base-500 text-body-l hover:bg-stroke-base-200"
                  disabled={isUploading}
                >
                  파일 선택
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-h3 text-text-base-700">파일 목록</h2>
              {files.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isPartiallySelected;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-stroke-base-300 cursor-pointer"
                    disabled={isUploading}
                  />
                  <span className="text-body-s text-text-base-500">
                    전체 선택 ({selectedFiles.length}/{files.length})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-center py-8 text-text-base-500">
                처리할 Excel 파일을 추가해주세요.
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="border border-stroke-base-100 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={(e) => handleFileCheck(file.id, e.target.checked)}
                          className="w-4 h-4 rounded border-stroke-base-300 cursor-pointer"
                          disabled={isUploading}
                        />
                        <div className="w-12 h-12 bg-accent-blue-100 rounded-lg flex items-center justify-center">
                          <Icon name="document" style="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-body-l text-text-base-700">
                              {file.name}
                            </p>
                            {getStatusIcon(file.status)}
                          </div>
                          <div className="flex items-center gap-4 text-body-s text-text-base-500">
                            <span>{getStatusText(file)}</span>
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        disabled={file.status === 'uploading'}
                        className={`${
                          file.status === 'uploading' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-gray-100'
                        } p-1 rounded`}
                      >
                        <Icon name="close" style="w-6 h-6 text-text-base-500" />
                      </button>
                    </div>
                        
                    {file.status === 'uploading' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-text-base-500 mb-1">
                          <span>처리 중...</span>
                          <span>{Math.round(file.progress || 0)}%</span>
                        </div>
                        <div className="w-full bg-stroke-base-100 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-text-base-500">
              총 {files.length}개 파일 | 처리 대기: {waitingFiles.length}개
            </div>
            <div className="flex gap-2">
              <Button
                variant="light"
                onClick={onClose}
                disabled={isUploading}
              >
                취소
              </Button>
              <Button
                variant="default"
                onClick={handleStartUpload}
                disabled={isUploading || waitingFiles.length === 0 || !orderDateFrom || !orderDateTo}
                className="bg-primary-500 text-white"
              >
                {isUploading ? 'Smile Macro 처리 중...' : `Smile Macro 처리 시작`}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {bulkResult && (
        <BulkResultModal
          isOpen={showResultModal}
          onClose={handleResultModalClose}
          type={bulkResult.type}
          title={bulkResult.title}
          message={bulkResult.message}
          fileResults={bulkResult.fileResults}
          urlLabel="결과 파일"
          showCopyButton={true}
        />
      )}
    </>
  );
};