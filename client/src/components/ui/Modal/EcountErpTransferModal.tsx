import { postEcountErpDownload } from "@/api/ecount/postEcountErpDownload";
import type { FileResult } from "@/api/types/common";
import type { ErpTransferRequest } from "@/api/types/ecount.types";
import { useAuthContext } from "@/contexts";
import { useState } from "react";
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

const createErpTransferRequest = (
  StDate: string,
  EdDate: string,
  formName: 'okmart_erp_sale_ok' | 'okmart_erp_sale_iyes' | 'iyes_erp_sale_iyes' | 'iyes_erp_purchase_iyes',
  requestId: string
): ErpTransferRequest => {
  return {
    data: {
      date_from: StDate,
      date_to: EdDate,
      form_name: formName
    },
    metadata: {
      request_id: requestId
    }
  };
};

export const EcountErpTransferModal = ({
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { user } = useAuthContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [formTemplate, setFormTemplate] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [bulkResult, setBulkResult] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    fileResults: FileResult[];
  } | null>(null);

  const handleStartProcessing = async () => {
    if (!formTemplate.trim()) {
      toast.error('ERP 템플릿을 선택해주세요.');
      return;
    }

    if (!dateFrom || !dateTo) {
      toast.error('시작일과 종료일을 모두 입력해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const userId = user?.preferred_username || 'unknown';
      // console.log('user', user);
      // console.log('userId', userId);

      const requestData = createErpTransferRequest(
        dateFrom,
        dateTo,
        formTemplate.trim() as 'okmart_erp_sale_ok' | 'okmart_erp_sale_iyes' | 'iyes_erp_sale_iyes' | 'iyes_erp_purchase_iyes',
        userId
      );

      const response = await postEcountErpDownload(requestData);
      
      // 응답이 성공적이고 필요한 데이터가 있으면 성공으로 처리
      if (response && response.data && response.data.batch_id) {
        const fileName = response.data.excel_file_name || `${formTemplate}_${Date.now()}.xlsx`;
        
        const fileResults: FileResult[] = [{
          name: fileName,
          status: 'success' as const,
          url: response.data.download_url
        }];

        setBulkResult({
          type: 'success',
          title: 'ERP 업로드 파일 생성 완료',
          message: `처리된 건수: ${response.data.processed_records}건\n전체 건수: ${response.data.total_records}건\n${response.data.file_size ? `파일 크기: ${formatFileSize(response.data.file_size)}\n` : ''}배치 ID: ${response.data.batch_id}\n요청 ID: ${response.metadata.request_id}\nAPI 버전: ${response.metadata.version}\n기간: ${response.data.date_range.from} ~ ${response.data.date_range.to}\n생성 시간: ${new Date().toLocaleString('ko-KR')}\n\nERP 업로드용 Excel 파일이 생성되었습니다.`,
          fileResults
        });

        setShowResultModal(true);
        toast.success('ERP 업로드 파일이 성공적으로 생성되었습니다.');
      } else {
        throw new Error('ERP 파일 생성 실패');
      }
    } catch (error) {
      const fileResults: FileResult[] = [{
        name: `${formTemplate}_${Date.now()}.xlsx`,
        status: 'error' as const,
      }];

      setBulkResult({
        type: 'error',
        title: 'ERP 파일 생성 실패',
        message: `ERP 업로드 파일 생성 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`,
        fileResults
      });

      setShowResultModal(true);
      toast.error('ERP 파일 생성 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setBulkResult(null);
    setFormTemplate('');
    setDateFrom('');
    setDateTo('');
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
          <Modal.Title>ERP 업로드용 Excel 파일 생성</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body className="h-[600px] flex flex-col">
          <div className="mb-6 p-4 bg-fill-base-50">
            <h3 className="text-h4 text-text-base-700 mb-3">ERP 전송 설정</h3>
            
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-body-s text-text-base-600 mb-1">시작일</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    disabled={isProcessing}
                    className="bg-fill-base-100 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-body-s text-text-base-600 mb-1">종료일</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    disabled={isProcessing}
                    className="bg-fill-base-100 cursor-pointer"
                  />
                </div>
              </div>

              {formTemplate && (
                <div className="mt-4 p-3 bg-fill-alt-50 rounded border border-stroke-base-100">
                  <p className="text-body-s text-text-base-600 mb-1">선택된 템플릿:</p>
                  <p className="text-body-m text-text-base-800 font-medium">{getSelectedTemplateLabel()}</p>
                  {dateFrom && dateTo && (
                    <p className="text-body-s text-text-base-600 mt-1">
                      기간: {dateFrom} ~ {dateTo}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-fill-warning-50 rounded border border-stroke-base-100">
            <h4 className="text-body-m font-medium text-text-warning-700 mb-2">안내사항</h4>
            <ul className="text-body-s text-text-warning-600 space-y-1">
              <li>• down_form_orders 테이블의 데이터를 기반으로 ERP 업로드용 Excel 파일을 생성합니다.</li>
              <li>• 선택한 템플릿에 따라 적절한 데이터 필터링 및 변환이 적용됩니다.</li>
              <li>• 지정한 기간 내의 데이터만 포함됩니다.</li>
              <li>• 생성된 파일은 즉시 다운로드되며, 일정 시간 후 자동 삭제됩니다.</li>
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
              <Button
                variant="default"
                onClick={handleStartProcessing}
                disabled={isProcessing || !formTemplate.trim() || !dateFrom || !dateTo}
                className="bg-primary-500 text-white"
              >
                {isProcessing ? 'ERP 파일 생성 중...' : 'ERP 파일 생성'}
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
          urlLabel="ERP 파일"
          showCopyButton={true}
        />
      )}
    </>
  );
};