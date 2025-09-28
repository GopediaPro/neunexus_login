import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/auth";
import { Modal } from "@/components/ui/ModalComponent";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/Icon";
// import { MallConfigButton } from "@/components/ui/Button/MallConfigButton";
// import { MallConfigModal } from "@/components/ui/Modal/MallConfigModal";
import { postSabangUploadByExcel, createSabangUploadRequest } from "@/api/product/postSabangUploadByExcel";
import type { FileResult } from "@/api/types/common";
// import type { MallConfigs } from "@/constants/mallConfig";

export const SabangUploadByExcelModal = ({
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
  const [sheetName, setSheetName] = useState('상품등록');
  // const [showMallConfigModal, setShowMallConfigModal] = useState(false);
  // const [mallConfigs, setMallConfigs] = useState<MallConfigs | null>(null);

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

    if (!sheetName.trim()) {
      toast.error('시트명을 입력해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const userId = user?.preferred_username || 'unknown';
      const requestData = createSabangUploadRequest(
        sheetName.trim(),
        userId,
        null // mallConfigs는 주석처리됨
      );

      const response = await postSabangUploadByExcel(file, requestData);
      
      if (response.success) {
        const fileResults: FileResult[] = [{
          name: file.name,
          status: 'success' as const,
        }];

        setBulkResult({
          type: 'success',
          title: '사방넷 업로드 By Excel 완료',
          message: `처리 완료: ${response.message}\n\n상품 등록 결과: ${JSON.stringify(response.product_registration, null, 2)}\n쇼핑몰별 판매가 설정 결과: ${JSON.stringify(response.mall_value_setting, null, 2)}\n전체 성공 여부: ${response.overall_success}`,
          fileResults
        });

        setShowResultModal(true);
        toast.success('사방넷 업로드 By Excel이 성공적으로 완료되었습니다.');
      } else {
        throw new Error(response.error || '사방넷 업로드 By Excel 실패');
      }
    } catch (error) {
      const fileResults: FileResult[] = [{
        name: file.name,
        status: 'error' as const,
      }];

      setBulkResult({
        type: 'error',
        title: '사방넷 업로드 By Excel 실패',
        message: `사방넷 업로드 By Excel 처리 중 오류가 발생했습니다.\n오류 시간: ${new Date().toLocaleString('ko-KR')}\n\n${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n다시 시도해주세요.`,
        fileResults
      });

      setShowResultModal(true);
      toast.error('사방넷 업로드 By Excel 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClose = () => {
    setSheetName('상품등록');
    setBulkResult(null);
    setShowResultModal(false);
    // setShowMallConfigModal(false);
    // setMallConfigs(null);
    onClose();
  };

  // const handleMallConfigApply = (configs: MallConfigs) => {
  //   setMallConfigs(configs);
  // };

  const handleResultModalClose = () => {
    setShowResultModal(false);
    setBulkResult(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>사방넷 업로드 By Excel</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-base-500 mb-2">
                  시트명
                </label>
                <Input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  placeholder="시트명을 입력하세요"
                  className="w-full"
                />
              </div>

              {/* 쇼핑몰별 판매가 설정 기능 주석처리 */}
              {/* <div>
                <label className="block text-sm font-medium text-text-base-500 mb-2">
                  쇼핑몰별 판매가 설정
                </label>
                <MallConfigButton
                  onClick={() => setShowMallConfigModal(true)}
                  isConfigSet={mallConfigs !== null}
                  disabled={isProcessing}
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-text-base-500 mb-2">
                  Excel 파일 업로드
                </label>
                <div className="border-2 border-dashed border-stroke-base-200 rounded-lg p-6 text-center">
                  <Icon name="upload" style="w-8 h-8 text-text-base-400 mx-auto mb-2" />
                  <p className="text-text-base-400 mb-4">
                    Excel 파일을 선택하거나 여기에 드래그하세요
                  </p>
                  <Button
                    variant="light"
                    onClick={handleFileUpload}
                    disabled={isProcessing}
                    className="mb-2"
                  >
                    {isProcessing ? (
                      <>
                        <Icon name="loader" style="w-4 h-4 animate-spin mr-2" />
                        처리 중...
                      </>
                    ) : (
                      <>
                        <Icon name="upload" style="w-4 h-4 mr-2" />
                        파일 선택
                      </>
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button variant="light" onClick={handleClose}>
              취소
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* 결과 모달 */}
      {showResultModal && bulkResult && (
        <Modal
          isOpen={showResultModal}
          onClose={handleResultModalClose}
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>{bulkResult.title}</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          
          <Modal.Body>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                bulkResult.type === 'success' ? 'bg-green-50 border border-green-200' :
                bulkResult.type === 'error' ? 'bg-red-50 border border-red-200' :
                bulkResult.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="whitespace-pre-wrap text-sm text-text-base-600">
                  {bulkResult.message}
                </div>
              </div>

              {bulkResult.fileResults && bulkResult.fileResults.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text-base-500 mb-2">파일 결과</h4>
                  <div className="space-y-2">
                    {bulkResult.fileResults.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-fill-alt-100 rounded">
                        <span className="text-sm text-text-base-600">{file.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          file.status === 'success' ? 'bg-green-100 text-green-800' :
                          file.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {file.status === 'success' ? '성공' : 
                           file.status === 'error' ? '실패' : '경고'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className="flex justify-end gap-2">
              <Button variant="light" onClick={handleResultModalClose}>
                확인
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}

      {/* 쇼핑몰별 판매가 설정 모달 주석처리 */}
      {/* <MallConfigModal
        isOpen={showMallConfigModal}
        onClose={() => setShowMallConfigModal(false)}
        onApply={handleMallConfigApply}
        initialConfigs={mallConfigs || undefined}
      /> */}
    </>
  );
};
