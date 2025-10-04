import { useState } from "react";
import { Modal } from "../ModalComponent";
import { Button } from "../Button";
import { toast } from "sonner";
import { BulkResultModal } from "./ResultBulkModal";
import { postDbToExcel } from "@/api/order/postDbToExcel";
import { useAuthContext } from "@/contexts";
import type { DbToExcelRequest } from "@/api/types";
import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { FORM_NAME_OPTIONS } from "@/constants/order";

interface FileResult {
  name: string;
  url?: string;
  status: 'success' | 'error';
}

const createDbToExcelRequest = (
  ordStDate: string,
  ordEdDate: string,
  formName: string,
  requestId?: string
): DbToExcelRequest => {
  return {
    data: {
      ord_st_date: ordStDate,
      ord_ed_date: ordEdDate,
      form_name: formName
    },
    metadata: {
      request_id: requestId 
    }
  };
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const DbToExcelModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { user } = useAuthContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [orderDateFrom, setOrderDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [orderDateTo, setOrderDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [formName, setFormName] = useState('');
  const [bulkResult, setBulkResult] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    fileResults: FileResult[];
  } | null>(null);

  const handleStartProcessing = async () => {
    if (!orderDateFrom || !orderDateTo) {
      toast.error('주문 날짜를 설정해주세요.');
      return;
    }

    if (!formName.trim()) {
      toast.error('Form Name을 입력해주세요.');
      return;
    }

    if (new Date(orderDateFrom) > new Date(orderDateTo)) {
      toast.error('시작 날짜는 종료 날짜보다 이전이어야 합니다.');
      return;
    }

    setIsProcessing(true);

    try {
      const requestId = user?.preferred_username || 'unknown';
      
      const ordStDateISO = new Date(orderDateFrom + 'T00:00:00.000Z').toISOString();
      const ordEdDateISO = new Date(orderDateTo + 'T23:59:59.999Z').toISOString();

      const requestData = createDbToExcelRequest(
        ordStDateISO,
        ordEdDateISO,
        formName.trim(),
        requestId
      );

      const response = await postDbToExcel(requestData);
      
      if (response.success) {
        const fileName = response.data.excel_url.split('/').pop() || `${formName}_${orderDateFrom}_${orderDateTo}.xlsx`;
        
        const fileResults: FileResult[] = [{
          name: fileName,
          status: 'success' as const,
          url: response.data.excel_url
        }];

        setBulkResult({
          type: 'success',
          title: 'Excel 파일 생성 완료',
          message: `처리된 건수: ${response.data.record_count}건\n파일 크기: ${formatFileSize(response.data.file_size)}\n요청 ID: ${response.metadata.request_id}\nAPI 버전: ${response.metadata.version}\n생성 시간: ${new Date().toLocaleString('ko-KR')}\n\n다운로드 링크가 제공되었습니다.`,
          fileResults
        });

        setShowResultModal(true);
        toast.success('Excel 파일이 성공적으로 생성되었습니다.');
      } else {
        throw new Error(response.message || 'Excel 파일 생성 실패');
      }
    } catch (error) {
      const fileResults: FileResult[] = [{
        name: `${formName}_${orderDateFrom}_${orderDateTo}.xlsx`,
        status: 'error' as const,
      }];

      setBulkResult({
        type: 'error',
        title: 'Excel 파일 생성 실패',
        message: `Excel 파일 생성 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`,
        fileResults
      });

      setShowResultModal(true);
      toast.error('Excel 파일 생성 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setBulkResult(null);
    setOrderDateFrom(new Date().toISOString().split('T')[0]);
    setOrderDateTo(new Date().toISOString().split('T')[0]);
    setFormName('');
    onClose();
  };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    if (bulkResult?.type === 'success') {
      handleClose();
    }
    setBulkResult(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
        <Modal.Header>
          <Modal.Title>주문 데이터 Excel 생성</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body className="h-[500px] flex flex-col">
          <div className="mb-6 p-4 bg-fill-base-50">
            <h3 className="text-h4 text-text-base-700 mb-3">Excel 생성 설정</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex flex-col flex-1">
                  <label className="text-body-s text-text-base-600 mb-1">시작 날짜</label>
                  <input
                    type="date"
                    value={orderDateFrom}
                    onChange={(e) => setOrderDateFrom(e.target.value)}
                    className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
                    disabled={isProcessing}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-body-s text-text-base-600 mb-1">종료 날짜</label>
                  <input
                    type="date"
                    value={orderDateTo}
                    onChange={(e) => setOrderDateTo(e.target.value)}
                    className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
                    disabled={isProcessing}
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-body-s text-text-base-600 mb-1">Form Name</label>
                <SelectSearchInput
                  options={FORM_NAME_OPTIONS}
                  value={formName}
                  onChange={setFormName}
                  placeholder="Form Name을 선택해주세요"
                />
              </div>
            </div>
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
              <Button
                variant="default"
                onClick={handleStartProcessing}
                disabled={isProcessing || !orderDateFrom || !orderDateTo || !formName.trim()}
                className="bg-primary-500 text-white"
              >
                {isProcessing ? 'Excel 생성 중...' : 'Excel 파일 생성'}
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
          urlLabel="Excel 파일"
          showCopyButton={true}
        />
      )}
    </>
  );
};