import { postEcountAllDataUpload } from "@/api/ecount/postEcountAllDataUpload";
import { postEcountErpPartnerDownload } from "@/api/ecount/postEcountErpPartnerDownload";
import { postEcountErpPartnerUpload } from "@/api/ecount/postEcountErpPartnerUpload";
import { postEcountIyesCostDownload } from "@/api/ecount/postEcountIyesCostDownload";
import { postEcountIyesCostUpload } from "@/api/ecount/postEcountIyesCostUpload";
import type { FileResult } from "@/api/types/common";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Modal } from "../ModalComponent";
import { Button } from "../Button";
import { BulkResultModal } from "./ResultBulkModal";

interface EcountUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcountUploadModal = ({ isOpen, onClose }: EcountUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [uploadType, setUploadType] = useState<'erp-partner' | 'iyes-cost' | 'all-data'>('erp-partner');
  const [sheetName, setSheetName] = useState('Sheet1');
  const [clearExisting, setClearExisting] = useState(false);
  const [erpSheet, setErpSheet] = useState('ERP_거래처코드');
  const [iyesSheet, setIyesSheet] = useState('아이예스_단가');
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

    setIsProcessing(true);

    try {
      const requestId = `ecount_${Date.now()}`;
      let response;

      switch (uploadType) {
        case 'erp-partner':
          response = await postEcountErpPartnerUpload(file, {
            data: {
              sheet_name: sheetName,
              clear_existing: clearExisting
            },
            metadata: {
              request_id: requestId
            }
          });
          break;
        case 'iyes-cost':
          response = await postEcountIyesCostUpload(file, {
            data: {
              sheet_name: sheetName,
              clear_existing: clearExisting
            },
            metadata: {
              request_id: requestId
            }
          });
          break;
        case 'all-data':
          response = await postEcountAllDataUpload(file, {
            data: {
              clear_existing: clearExisting,
              erp_partner_code_sheet: erpSheet,
              iyes_cost_sheet: iyesSheet
            },
            metadata: {
              request_id: requestId
            }
          });
          break;
      }

      if (response.success && response.data.success) {
        const fileResults: FileResult[] = [{
          name: response.data.file_name,
          status: 'success' as const,
        }];

        setBulkResult({
          type: 'success',
          title: 'ECount 데이터 업로드 완료',
          message: `업로드된 건수: ${response.data.imported_count}건\n파일명: ${response.data.file_name}\n요청 ID: ${response.metadata.request_id}\n생성 시간: ${new Date().toLocaleString('ko-KR')}\n\n${response.data.message}`,
          fileResults
        });

        toast.success('ECount 데이터가 성공적으로 업로드되었습니다.');
      } else {
        throw new Error(response.data.message || 'ECount 업로드 실패');
      }
    } catch (error) {
      const fileResults: FileResult[] = [{
        name: file.name,
        status: 'error' as const,
      }];

      setBulkResult({
        type: 'error',
        title: 'ECount 업로드 실패',
        message: `ECount 데이터 업로드 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`,
        fileResults
      });

      toast.error('ECount 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
      setShowResultModal(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async (type: 'erp-partner' | 'iyes-cost') => {
    setIsProcessing(true);

    try {
      const requestId = `download_${Date.now()}`;
      let response;

      if (type === 'erp-partner') {
        response = await postEcountErpPartnerDownload({
          data: {},
          metadata: { request_id: requestId }
        });
      } else {
        response = await postEcountIyesCostDownload({
          data: {},
          metadata: { request_id: requestId }
        });
      }

      if (response.success) {
        window.open(response.data.download_url, '_blank');
        toast.success('파일 다운로드가 시작되었습니다.');
      } else {
        throw new Error('다운로드 실패');
      }
    } catch (error) {
      toast.error('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setBulkResult(null);
    setUploadType('erp-partner');
    setSheetName('Sheet1');
    setClearExisting(false);
    setErpSheet('ERP_거래처코드');
    setIyesSheet('아이예스_단가');
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
          <Modal.Title>ECount 데이터 관리</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body className="h-[600px] flex flex-col">
          <div className="mb-6 p-4 bg-fill-base-50">
            <h3 className="text-h4 text-text-base-700 mb-3">업로드 설정</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-body-s text-text-base-600 mb-1">업로드 타입</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  disabled={isProcessing}
                  className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
                >
                  <option value="erp-partner">ERP 파트너 코드</option>
                  <option value="iyes-cost">IYES 단가</option>
                  <option value="all-data">통합 데이터</option>
                </select>
              </div>

              {uploadType !== 'all-data' && (
                <div className="flex flex-col">
                  <label className="text-body-s text-text-base-600 mb-1">시트명</label>
                  <input
                    type="text"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    disabled={isProcessing}
                    className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
                    placeholder="Sheet1"
                  />
                </div>
              )}

              {uploadType === 'all-data' && (
                <>
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col flex-1">
                      <label className="text-body-s text-text-base-600 mb-1">ERP 파트너 시트명</label>
                      <input
                        type="text"
                        value={erpSheet}
                        onChange={(e) => setErpSheet(e.target.value)}
                        disabled={isProcessing}
                        className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
                        placeholder="ERP_거래처코드"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <label className="text-body-s text-text-base-600 mb-1">IYES 단가 시트명</label>
                      <input
                        type="text"
                        value={iyesSheet}
                        onChange={(e) => setIyesSheet(e.target.value)}
                        disabled={isProcessing}
                        className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
                        placeholder="아이예스_단가"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="clearExisting"
                  checked={clearExisting}
                  onChange={(e) => setClearExisting(e.target.checked)}
                  disabled={isProcessing}
                  className="rounded"
                />
                <label htmlFor="clearExisting" className="text-body-s text-text-base-600">
                  기존 데이터 삭제 후 업로드
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={handleFileUpload}
                disabled={isProcessing}
                className="bg-primary-500 text-white flex-1 cursor-pointer"
              >
                {isProcessing ? '업로드 중...' : 'Excel 파일 업로드'}
              </Button>
            </div>

            <div className="pt-4">
              <h4 className="text-body-m font-medium text-text-base-700 mb-3">템플릿 다운로드</h4>
              <div className="flex gap-2">
                <Button
                  variant="light"
                  onClick={() => handleDownload('erp-partner')}
                  disabled={isProcessing}
                  className="flex-1 cursor-pointer"
                >
                  ERP 파트너 템플릿
                </Button>
                <Button
                  variant="light"
                  onClick={() => handleDownload('iyes-cost')}
                  disabled={isProcessing}
                  className="flex-1 cursor-pointer"
                >
                  IYES 단가 템플릿
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-fill-warning-50 rounded border border-stroke-base-200">
            <h4 className="text-body-m font-medium text-text-warning-700 mb-2">안내사항</h4>
            <ul className="text-body-s text-text-warning-600 space-y-1">
              <li>• ERP 파트너 코드: 거래처 정보를 업로드합니다.</li>
              <li>• IYES 단가: 상품 단가 정보를 업로드합니다.</li>
              <li>• 통합 데이터: 한 파일에서 여러 시트의 데이터를 동시에 업로드합니다.</li>
              <li>• 템플릿을 다운로드하여 정확한 형식으로 데이터를 준비해주세요.</li>
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
                닫기
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
          urlLabel="업로드 파일"
          showCopyButton={false}
        />
      )}
    </>
  );
};