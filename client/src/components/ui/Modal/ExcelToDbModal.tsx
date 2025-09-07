import { useState } from "react";
import { Modal } from "../ModalComponent";
import { Button } from "../Button";
import { toast } from "sonner";
import { BulkResultModal } from "./ResultBulkModal";
import { postExcelToDb } from "@/api/order/postExcelToDb";
import { useAuthContext } from "@/contexts";
import type { ExcelToDbRequestData } from "@/api/types";
import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { FORM_NAME_OPTIONS, WORK_STATUS_OPTIONS } from "@/constant/order";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useBulkResult } from "@/hooks/useBulkResult";
import { useFormValidation } from "@/hooks/useFormValidation";
import { createSelectionHandlers } from "@/utils/createSelectionHandlers";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, TOAST_MESSAGES } from "@/constant/messages";
import { createProgressSimulator } from "@/utils/progressUtils";
import { FileDropZone } from "../FileDropZone";
import { SelectAllCheckbox } from "../SelectAllCheckbox";
import { FileListItem } from "../FileListItem";
import { formatFileSize } from "@/utils/fileUtils";

interface FileResult {
  name: string;
  url?: string;
  status: 'success' | 'error';
}

const createExcelToDbRequest = (
  formName: string,
  workStatus: string,
  requestId?: string
): ExcelToDbRequestData => {
  return {
    data: {
      form_name: formName,
      work_status: workStatus || undefined
    },
    metadata: {
      request_id: requestId 
    }
  };
};

const getApiErrorMessage = (error: any, fileName: string): string => {
  if (error?.error?.message) {
    const errorMessage = error.error.message;
    
    if (errorMessage.includes("order_id")) {
      return `${fileName}: order_id 컬럼이 필요합니다`;
    } else if (errorMessage.includes("BAD_REQUEST") || error.error.code === "BAD_REQUEST") {
      return `${fileName}: ${errorMessage}`;
    } else {
      return `${fileName}: ${errorMessage}`;
    }
  } else if (error instanceof Error) {
    return `${fileName}: ${error.message}`;
  } else {
    return `${fileName}: 알 수 없는 오류가 발생했습니다`;
  }
};

export const ExcelToDbModal = ({ 
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

  const [formName, setFormName] = useState('');
  const [workStatus, setWorkStatus] = useState('');

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

  const processFileUploads = async (filesToUpload: typeof files, requestData: ExcelToDbRequestData) => {
    const results: FileResult[] = [];
    let totalProcessed = 0;
    let totalInserted = 0;
    let totalUpdated = 0;
    let totalFailed = 0;

    for (const fileItem of filesToUpload) {
      if (!fileItem.file) continue;

      try {
        const response = await postExcelToDb({
          request: JSON.stringify(requestData),
          file: fileItem.file
        });

        if (response.success === true && response.data) {
          results.push({
            name: fileItem.name,
            status: 'success' as const
          });

          totalProcessed += response.data.processed_count || 0;
          totalInserted += response.data.inserted_count || 0;
          totalUpdated += response.data.updated_count || 0;
          totalFailed += response.data.failed_count || 0;
        } else {
          throw response;
        }
      } catch (error) {
        results.push({
          name: fileItem.name,
          status: 'error' as const
        });
        
        const errorMessage = getApiErrorMessage(error, fileItem.name);
        toast.error(errorMessage);
      }
    }

    return {
      results,
      stats: { totalProcessed, totalInserted, totalUpdated, totalFailed }
    };
  };

  const handleStartUpload = async () => {
    const filesToUpload = files.filter(file => file.status === 'waiting');

    if (filesToUpload.length === 0) {
      toast.warning(TOAST_MESSAGES.NO_FILES_TO_UPLOAD);
      return;
    }

    if (!validateForm({ formName })) {
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
      const requestId = user?.preferred_username || 'unknown';
      const requestData = createExcelToDbRequest(formName, workStatus, requestId);

      const { results, stats } = await processFileUploads(filesToUpload, requestData);
      const { totalProcessed, totalInserted, totalUpdated, totalFailed } = stats;

      clearInterval(progressInterval);

      const successCount = results.filter(r => r.status === 'success').length;
      const errorCount = results.filter(r => r.status === 'error').length;

      setFiles(prev => prev.map(file => 
        filesToUpload.some(f => f.id === file.id)
          ? { 
              ...file, 
              status: results.find(r => r.name === file.name)?.status === 'success' ? 'completed' : 'error', 
              progress: 100, 
              uploadTime: new Date().toLocaleString('ko-KR')
            }
          : file
      ));

      const successMessage = SUCCESS_MESSAGES.EXCEL_TO_DB.MESSAGE({
        processedCount: totalProcessed,
        insertedCount: totalInserted,
        updatedCount: totalUpdated,
        failedCount: totalFailed
      });

      const resultMessage = `총 처리 파일: ${filesToUpload.length}개\n성공: ${successCount}개 | 실패: ${errorCount}개\n\n${successMessage}`;

      showResult({
        type: errorCount === 0 ? 'success' : (successCount > 0 ? 'warning' : 'error'),
        title: SUCCESS_MESSAGES.EXCEL_TO_DB.TITLE,
        message: resultMessage,
        fileResults: results
      });
      
      if (errorCount === 0) {
        toast.success(TOAST_MESSAGES.UPLOAD_SUCCESS(successCount));
      } else {
        toast.warning(`${successCount}개 성공, ${errorCount}개 실패`);
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

      const errorMessage = ERROR_MESSAGES.EXCEL_TO_DB.MESSAGE(
        error instanceof Error ? error.message : '알 수 없는 오류'
      );

      showResult({
        type: 'error',
        title: ERROR_MESSAGES.EXCEL_TO_DB.TITLE,
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
    setFormName('');
    setWorkStatus('');
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
    return isUploading || waitingFiles.length === 0 || !formName.trim();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
        <Modal.Header>
          <Modal.Title>Excel to DB 업로드</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body className="h-[700px] flex flex-col">
          <div className="mb-6 p-4 border border-stroke-base-200 rounded-lg bg-fill-base-50">
            <h3 className="text-h4 text-text-base-700 mb-3">업로드 설정</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex flex-col flex-1">
                  <label className="text-body-s text-text-base-600 mb-1">Form Name *</label>
                  <SelectSearchInput
                    options={FORM_NAME_OPTIONS}
                    value={formName}
                    onChange={setFormName}
                    placeholder="Form Name을 선택해주세요"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-body-s text-text-base-600 mb-1">Work Status (선택)</label>
                  <SelectSearchInput
                    options={WORK_STATUS_OPTIONS}
                    value={workStatus}
                    onChange={setWorkStatus}
                    placeholder="작업 상태를 선택해주세요"
                  />
                </div>
              </div>
              <p className="text-body-xs text-text-base-500">
                * Form Name은 필수 항목입니다. Work Status는 선택사항입니다.
              </p>
            </div>
          </div>

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
                업로드할 Excel 파일을 추가해주세요.
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
                onClick={handleClose}
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
                {isUploading ? 'DB 업로드 중...' : 'DB 업로드 시작'}
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
          urlLabel="처리 결과"
          showCopyButton={false}
        />
      )}
    </>
  );
};