import { useState } from "react";
import { Modal } from "../ModalComponent";
import { Button } from "../Button";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts";
import { postExcelRunMacroBulk } from "@/api/order/postExcelRunMacroBulk";
import { BulkResultModal } from "./ResultBulkModal";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useBulkResult } from "@/hooks/useBulkResult";
import { TOAST_MESSAGES } from "@/constant/messages";
import { createProgressSimulator } from "@/utils/progressUtils";
import type { FileResult } from "@/api/types/common";
import { FileDropZone } from "../FileDropZone";
import { SelectAllCheckbox } from "../SelectAllCheckbox";
import { FileListItem } from "../FileListItem";
import { formatFileSize } from "@/utils/fileUtils";

interface TabType {
  BULK: 'bulk';
  INDIVIDUAL: 'individual';
}

const TAB_TYPES: TabType = {
  BULK: 'bulk',
  INDIVIDUAL: 'individual'
} as const;

export const ExcelBulkUploadModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const { user } = useAuthContext();
  const fileUpload = useFileUpload();
  const bulkResult = useBulkResult();
  
  const [activeTab, setActiveTab] = useState<'bulk' | 'individual'>('bulk');

  const {
    files,
    selectedFiles,
    isUploading,
    setFiles,
    setSelectedFiles,
    setIsUploading,
    addFiles,
    removeFile,
    resetFiles
  } = fileUpload;

  const {
    showResultModal,
    bulkResult: result,
    showResult,
    hideResult
  } = bulkResult;

  const uploadFiles = async (filesToUpload: typeof files) => {
    try {
      const fileObjects = filesToUpload
        .map(fileItem => fileItem.file)
        .filter((file): file is File => file !== undefined);

      const requestBody = {
        created_by: user?.preferred_username || 'unknown',
        filters: {
          date_from: new Date().toISOString().split('T')[0],
          date_to: new Date().toISOString().split('T')[0],
        }
      };

      const response = await postExcelRunMacroBulk({
        request: JSON.stringify(requestBody),
        files: fileObjects
      });

      return response;
    } catch (error) {
      toast.error(TOAST_MESSAGES.UPLOAD_ERROR);
      throw error;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allFileIds = files.map(file => file.id);
      setSelectedFiles(allFileIds);
      toast.info(TOAST_MESSAGES.ALL_SELECTED(files.length));
    } else {
      setSelectedFiles([]);
      toast.info(TOAST_MESSAGES.ALL_DESELECTED);
    }
  };

  const handleFileCheck = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const getFilesToUpload = () => {
    return activeTab === TAB_TYPES.BULK 
      ? files.filter(file => file.status === 'waiting')
      : files.filter(file => selectedFiles.includes(file.id) && file.status === 'waiting');
  };

  const handleStartUpload = async () => {
    const filesToUpload = getFilesToUpload();

    if (filesToUpload.length === 0) {
      toast.warning(TOAST_MESSAGES.NO_FILES_TO_UPLOAD);
      return;
    }

    setIsUploading(true);

    setFiles(prev => prev.map(file => 
      filesToUpload.some(f => f.id === file.id)
        ? { ...file, status: 'uploading', progress: 0 }
        : file
    ));

    const fileIds = filesToUpload.map(f => f.id);
    const progressInterval = createProgressSimulator(fileIds, setFiles);

    try {
      const response = await uploadFiles(filesToUpload);
      
      clearInterval(progressInterval);
      const fileResults: FileResult[] = [];

      // 성공 결과 처리
      if (response?.successful_results && Array.isArray(response.successful_results)) {
        response.successful_results.forEach((successResult: any) => {
          fileResults.push({
            name: successResult.filename,
            url: successResult.file_url,
            status: 'success'
          });
        });
      }

      // 실패 결과 처리
      if (response?.failed_results && Array.isArray(response.failed_results)) {
        response.failed_results.forEach((failResult: any) => {
          fileResults.push({
            name: failResult.filename,
            status: 'error'
          });
        });
      }

      // 파일 상태 업데이트
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

      const successCount = fileResults.filter(f => f.status === 'success').length;
      const errorCount = fileResults.filter(f => f.status === 'error').length;

      showResult({
        type: errorCount > 0 ? 'warning' : 'success',
        title: '대량 파일 처리 완료',
        message: `총 ${filesToUpload.length}개 파일 처리가 완료되었습니다.\n처리 시간: ${new Date().toLocaleString('ko-KR')}`,
        fileResults
      });

      toast.success(TOAST_MESSAGES.UPLOAD_SUCCESS(successCount));
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

      showResult({
        type: 'error',
        title: '대량 파일 처리 실패',
        message: `파일 처리 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n다시 시도해주세요.`,
        fileResults
      });

      toast.error(TOAST_MESSAGES.UPLOAD_ERROR);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    resetFiles();
    hideResult();
    onClose();
  };

  const handleResultModalClose = () => {
    if (result?.type === 'success' || result?.type === 'warning') {
      handleClose();
    }
    hideResult();
  };

  const waitingFiles = files.filter(f => f.status === 'waiting');
  const selectedWaitingFiles = files.filter(f => 
    selectedFiles.includes(f.id) && f.status === 'waiting'
  );
  
  const isAllSelected = files.length > 0 && selectedFiles.length === files.length;
  const isPartiallySelected = selectedFiles.length > 0 && selectedFiles.length < files.length;

  const getUploadButtonDisabled = () => {
    return isUploading || (
      activeTab === TAB_TYPES.BULK 
        ? waitingFiles.length === 0 
        : selectedWaitingFiles.length === 0
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
        <Modal.Header>
          <Modal.Title>대량파일 업로드</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body className="h-[600px] flex flex-col">
          <FileDropZone
            onFilesAdded={addFiles}
            accept=".xlsx,.xls"
            maxSize="50MB"
            isUploading={isUploading}
            multiple={true}
          />

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-h3 text-text-base-700">파일 목록</h2>
              {files.length > 0 && (
                <SelectAllCheckbox
                  isAllSelected={isAllSelected}
                  isPartiallySelected={isPartiallySelected}
                  onSelectAll={handleSelectAll}
                  selectedCount={selectedFiles.length}
                  totalCount={files.length}
                  disabled={isUploading}
                />
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveTab(TAB_TYPES.BULK)}
                className={`py-1 px-4 ${
                  activeTab === TAB_TYPES.BULK 
                    ? 'bg-primary-500 text-text-contrast-500' 
                    : 'bg-fill-alt-200 text-text-base-500 hover:bg-fill-alt-300'
                }`}
              >
                일괄파일처리
              </Button>
              <Button
                onClick={() => setActiveTab(TAB_TYPES.INDIVIDUAL)}
                className={`py-1 px-4 ${
                  activeTab === TAB_TYPES.INDIVIDUAL 
                    ? 'bg-primary-500 text-text-contrast-500' 
                    : 'bg-fill-alt-200 text-text-base-500 hover:bg-fill-alt-300'
                }`}
              >
                선택파일 처리
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-center py-8 text-text-base-500">
                업로드할 파일을 추가해주세요.
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <FileListItem
                    key={file.id}
                    file={file}
                    isSelected={selectedFiles.includes(file.id)}
                    onSelect={(checked) => handleFileCheck(file.id, checked)}
                    onRemove={() => removeFile(file.id)}
                    isUploading={isUploading}
                    formatFileSize={formatFileSize}
                  />
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-text-base-500">
              총 {files.length}개 파일 | 선택된 파일: {selectedFiles.length}개
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
                disabled={getUploadButtonDisabled()}
                className="bg-primary-500 text-white"
              >
                {isUploading ? '업로드 중...' : '업로드 시작'}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {result && (
        <BulkResultModal
          isOpen={showResultModal}
          onClose={handleResultModalClose}
          type={result.type}
          title={result.title}
          message={result.message}
          fileResults={result.fileResults}
          urlLabel="다운로드 링크"
          showCopyButton={true}
        />
      )}
    </>
  );
};