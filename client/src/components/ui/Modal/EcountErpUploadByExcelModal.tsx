import { postEcountErpUploadByExcel } from "@/api/ecount/postEcountErpUploadByExcel";
import type { FileResult } from "@/api/types/common";
import type { ErpBulkUploadRequest } from "@/api/types/ecount.types";
import { useAuthContext } from "@/contexts";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "../ModalComponent";
import { ERP_TEMPLATE_OPTIONS } from "@/constant/order";
import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { Button } from "../Button";
import { BulkResultModal } from "./ResultBulkModal";
import { Input } from "../input";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const createErpBulkUploadRequest = (
  sheetName: string,
  formTemplate: string,
  userId: string
): ErpBulkUploadRequest => {
  // .env 파일에서 IS_TEST 값을 읽어오거나, 없으면 false로 설정
  const isTest = import.meta.env.VITE_IS_TEST === 'true';
  // console.log('isTest', isTest);
  return {
    data: {
      sheet_name: sheetName,
      template_code: formTemplate,
      is_test: isTest,
      clear_existing: false,
    },
    metadata: {
      request_id: userId
    }
  };
};

export const EcountErpUploadByExcelModal = ({
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { user } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [formTemplate, setFormTemplate] = useState('');
  const [sheetName, setSheetName] = useState('Sheet1');

  // formTemplate에 따라 sheetName 기본값 설정
  const getDefaultSheetName = (template: string): string => {
    if (template.includes('erp_sale') || template.includes('ERP 판매')) {
      return '1_판매입력';
    }
    if (template.includes('erp_purchase') || template.includes('ERP 구매')) {
      return '구매입력';
    }
    return 'Sheet1';
  };

  // formTemplate이 변경될 때 sheetName 자동 업데이트
  useEffect(() => {
    if (formTemplate) {
      const defaultSheetName = getDefaultSheetName(formTemplate);
      setSheetName(defaultSheetName);
    }
  }, [formTemplate]);
  const [bulkResult, setBulkResult] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    fileResults: FileResult[];
  } | null>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!formTemplate.trim()) {
      toast.error('ERP 템플릿을 선택해주세요.');
      return;
    }

    if (!sheetName.trim()) {
      toast.error('시트명을 입력해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const userId = user?.preferred_username || 'unknown';
      const requestData = createErpBulkUploadRequest(
        sheetName.trim(),
        formTemplate.trim(),
        userId
      );

      const response = await postEcountErpUploadByExcel(file, requestData);
      
      if (response.success && response.data.success) {
        const fileResults: FileResult[] = [{
          name: response.data.batch_info.file_name,
          status: 'success' as const,
          url: response.data.batch_info.file_url
        }];

        setBulkResult({
          type: 'success',
          title: 'ERP 업로드 By Excel 완료',
          message: `처리된 건수: ${response.data.batch_info.total_processed}건\n성공 건수: ${response.data.batch_info.success_count}건\n실패 건수: ${response.data.batch_info.fail_count}건\n검증 오류: ${response.data.batch_info.validation_errors}건\n배치 ID: ${response.data.batch_info.batch_id}\n요청 ID: ${response.metadata.request_id}\nAPI 버전: ${response.metadata.version}\n처리 시간: ${response.data.batch_info.processed_at}\n파일 크기: ${formatFileSize(response.data.batch_info.file_size)}\n\n${response.data.message}`,
          fileResults
        });

        setShowResultModal(true);
        toast.success('ERP 업로드 By Excel이 성공적으로 완료되었습니다.');
      } else {
        throw new Error(response.data.message || 'ERP 업로드 By Excel 실패');
      }
    } catch (error) {
      const fileResults: FileResult[] = [{
        name: file.name,
        status: 'error' as const,
      }];

      setBulkResult({
        type: 'error',
        title: 'ERP 업로드 By Excel 실패',
        message: `ERP 업로드 By Excel 처리 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`,
        fileResults
      });

      setShowResultModal(true);
      toast.error('ERP 업로드 By Excel 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClose = () => {
    setBulkResult(null);
    setFormTemplate('');
    setSheetName('Sheet1');
    onClose();
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    if (bulkResult?.type === 'success') {
      handleClose();
    }
    setBulkResult(null);
  };

  const getSelectedTemplateLabel = () => {
    const selectedOption = ERP_TEMPLATE_OPTIONS.find(option => option.value === formTemplate);
    return selectedOption?.label || '';
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
        <Modal.Header>
          <Modal.Title>ERP 업로드 By Excel</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body className="h-[600px] flex flex-col">
          <div className="mb-6 p-4 bg-fill-base-50">
            <h3 className="text-h4 text-text-base-700 mb-3">업로드 설정</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-body-s text-text-base-600 mb-1">ERP 템플릿</label>
                <SelectSearchInput
                  options={ERP_TEMPLATE_OPTIONS}
                  value={formTemplate}
                  onChange={setFormTemplate}
                  placeholder="ERP 템플릿을 선택해주세요"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-body-s text-text-base-600 mb-1">시트명</label>
                <Input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Sheet1"
                  className="bg-fill-base-100"
                />
              </div>

              {formTemplate && (
                <div className="mt-4 p-3 bg-fill-alt-50 rounded border border-stroke-base-100">
                  <p className="text-body-s text-text-base-600 mb-1">선택된 템플릿:</p>
                  <p className="text-body-m text-text-base-800 font-medium">{getSelectedTemplateLabel()}</p>
                  {sheetName && (
                    <p className="text-body-s text-text-base-600 mt-1">
                      시트명: {sheetName}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={handleFileUpload}
                disabled={isProcessing || !formTemplate.trim() || !sheetName.trim()}
                className="bg-primary-500 text-white flex-1 cursor-pointer"
              >
                {isProcessing ? '업로드 중...' : 'Excel 파일 업로드'}
              </Button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-fill-warning-50 rounded border border-stroke-base-100">
            <h4 className="text-body-m font-medium text-text-warning-700 mb-2">안내사항</h4>
            <ul className="text-body-s text-text-warning-600 space-y-1">
              <li>• Excel 파일을 업로드하여 ERP 데이터를 일괄 생성합니다.</li>
              <li>• 선택한 템플릿에 따라 적절한 데이터 변환이 적용됩니다.</li>
              <li>• 지정한 시트명에서 데이터를 읽어옵니다.</li>
              <li>• 업로드된 파일은 처리 후 자동으로 삭제됩니다.</li>
            </ul>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <div className="flex items-center justify-between w-full">
            <div />
            <div className="flex gap-2">
              <Button
                variant="light"
                onClick={handleClose}
                disabled={isProcessing}
              >
                취소
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {bulkResult && (
        <BulkResultModal
          isOpen={showResultModal}
          onClose={handleResultModalClose}
          type={bulkResult.type}
          title={bulkResult.title}
          message={bulkResult.message}
          fileResults={bulkResult.fileResults}
          urlLabel="ERP 파일"
          showCopyButton={true}
        />
      )}
    </>
  );
};
