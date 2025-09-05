import { useState } from "react";
import { Modal } from "../ModalComponent";
import { Button } from "../Button";
import { toast } from "sonner";
import { BulkResultModal } from "./ResultBulkModal";
import { postSmileMacroMultiple } from "@/api/order/postSmileMacro";
import { useAuthContext } from "@/contexts";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useBulkResult } from "@/hooks/useBulkResult";
import { useFormValidation } from "@/hooks/useFormValidation";
import { createSelectionHandlers } from "@/utils/createSelectionHandlers";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, TOAST_MESSAGES } from "@/constant/messages";
import { createProgressSimulator } from "@/utils/progressUtils";
import { DateRangeSelector } from "../DateRangeSelector";
import { FileDropZone } from "../FileDropZone";
import { SelectAllCheckbox } from "../SelectAllCheckbox";
import { FileListItem } from "../FileListItem";
import { formatFileSize } from "@/utils/fileUtils";

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
      request_id: requestId 
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
  const { user } = useAuthContext();
  const fileUpload = useFileUpload();
  const bulkResult = useBulkResult();
  const { validateForm } = useFormValidation();

  const [orderDateFrom, setOrderDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [orderDateTo, setOrderDateTo] = useState(new Date().toISOString().split('T')[0]);

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

  const {
    handleItemCheck,
    handleSelectAll,
    isAllSelected,
    isPartiallySelected
  } = createSelectionHandlers(selectedFiles, setSelectedFiles, files);

  const handleStartUpload = async () => {
    const filesToUpload = files.filter(file => file.status === 'waiting');

    if (filesToUpload.length === 0) {
      toast.warning(TOAST_MESSAGES.NO_FILES_TO_UPLOAD);
      return;
    }

    if (!validateForm({ orderDateFrom, orderDateTo })) {
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
      const fileObjects = filesToUpload
        .map(fileItem => fileItem.file)
        .filter((file): file is File => file !== undefined);
      
      const requestId = user?.preferred_username || 'unknown';
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

        const successMessage = SUCCESS_MESSAGES.SMILE_MACRO.MESSAGE({
          batchId: response.data.batch_id,
          processedCount: response.data.processed_count,
          aFileUrl: response.data.a_file_url,
          gFileUrl: response.data.g_file_url
        });

        showResult({
          type: 'success',
          title: SUCCESS_MESSAGES.SMILE_MACRO.TITLE,
          message: successMessage,
          fileResults
        });

        toast.success(TOAST_MESSAGES.UPLOAD_SUCCESS(filesToUpload.length));
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

      const errorMessage = ERROR_MESSAGES.SMILE_MACRO.MESSAGE(
        error instanceof Error ? error.message : '알 수 없는 오류'
      );

      showResult({
        type: 'error',
        title: ERROR_MESSAGES.SMILE_MACRO.TITLE,
        message: errorMessage,
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
    setOrderDateFrom(new Date().toISOString().split('T')[0]);
    setOrderDateTo(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const handleResultModalClose = () => {
    if (result?.type === 'success') {
      handleClose();
    }
    hideResult();
  };

  const waitingFiles = files.filter(f => f.status === 'waiting');

  const getUploadButtonDisabled = () => {
    return isUploading || waitingFiles.length === 0 || !orderDateFrom || !orderDateTo;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
        <Modal.Header>
          <Modal.Title>Smile Macro 대량 처리</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body className="h-[700px] flex flex-col">
          <DateRangeSelector
            startDate={orderDateFrom}
            endDate={orderDateTo}
            onStartDateChange={setOrderDateFrom}
            onEndDateChange={setOrderDateTo}
            disabled={isUploading}
            label="주문 날짜 설정"
          />

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
          </div>

          <div className="flex-1 overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-center py-8 text-text-base-500">
                처리할 Excel 파일을 추가해주세요.
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <FileListItem
                    key={file.id}
                    file={file}
                    isSelected={selectedFiles.includes(file.id)}
                    onSelect={(checked) => handleItemCheck(file.id, checked)}
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
                disabled={getUploadButtonDisabled()}
                className="bg-primary-500 text-white"
              >
                {isUploading ? 'Smile Macro 처리 중...' : 'Smile Macro 처리 시작'}
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
          urlLabel="결과 파일"
          showCopyButton={true}
        />
      )}
    </>
  );
};