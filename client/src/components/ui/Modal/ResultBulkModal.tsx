import { toast } from "sonner";
import { Modal } from ".";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface FileResult {
  name: string;
  url?: string;
  status: 'success' | 'error';
}

interface BulkResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  fileResults?: FileResult[];
  urlLabel?: string;
  showCopyButton?: boolean;
}

export const BulkResultModal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  fileResults = [],
  showCopyButton = true
}: BulkResultModalProps) => {
  const messages = message.split('\n');

  const getThemeColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-fill-base-200',
          border: 'border-primary-200',
          text: 'text-primary-600',
          accent: 'text-text-base-500',
          button: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
        };
      case 'error':
        return {
          bg: 'bg-rose-50/90',
          border: 'border-rose-200',
          text: 'text-rose-900',
          accent: 'text-rose-700',
          button: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/90',
          border: 'border-amber-200',
          text: 'text-amber-900',
          accent: 'text-amber-700',
          button: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
        };
      case 'info':
      default:
        return {
          bg: 'bg-indigo-50/90',
          border: 'border-indigo-200',
          text: 'text-indigo-900',
          accent: 'text-indigo-700',
          button: 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600',
        };
    }
  };

  const handleCopyUrl = async (url: string) => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('링크가 복사되었습니다.');
    } catch (error) {
      console.error('복사 실패:', error);
      toast.error('복사에 실패했습니다.');
    }
  };

  const colors = getThemeColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body className="max-h-[600px]">
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-8">
          <div className="flex justify-center">
            <Icon name="upload-check" style="w-[100px] h-[100px] text-primary-500" />
          </div>

          <div className="flex flex-col items-center gap-6 w-full text-center">
            <h3 className="flex flex-col gap-1 w-full">
              <p className="text-h2 text-primary-500 font-bold">
                {title}
              </p>
              <p className="text-body-l text-text-base-500">
                {messages[0]}
              </p>
            </h3>

            {fileResults.length > 0 && (
              <div className="w-full space-y-4">
                <div className="text-left">
                  <label className={`block text-body-l ${colors.accent} mb-3 flex items-center gap-2`}>
                    <Icon name="document" ariaLabel="document" style="w-5 h-5 text-primary-500" />
                    처리 결과 ({fileResults.length}개 파일)
                  </label>
                </div>
                
                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                  {fileResults.map((fileResult, index) => (
                    <div 
                      key={index} 
                      className={`w-full border-2 ${colors.border} p-4 rounded-lg ${colors.bg}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="bg-accent-blue-100 rounded-lg p-2 flex-shrink-0">
                            <Icon 
                              name={fileResult.status === 'success' ? "check" : "alert"} 
                              ariaLabel={fileResult.status} 
                              style={`w-4 h-4 ${fileResult.status === 'success' ? 'text-primary-500' : 'text-rose-500'}`} 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-body-l text-text-base-700 font-medium truncate">
                              {fileResult.name}
                            </p>
                            <p className={`text-body-s ${fileResult.status === 'success' ? 'text-primary-600' : 'text-rose-600'}`}>
                              {fileResult.status === 'success' ? '처리 완료' : '처리 실패'}
                            </p>
                          </div>
                        </div>
                        
                        {fileResult.url && fileResult.status === 'success' && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <input
                              type="text"
                              value={fileResult.url}
                              readOnly
                              className="w-64 px-3 py-2 text-sm bg-fill-base-100 rounded-lg text-text-base-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                            />
                            {showCopyButton && (
                              <Button
                                onClick={() => handleCopyUrl(fileResult.url!)}
                                className="flex items-center px-3 py-2 bg-primary-300 text-body-s text-text-contrast-500 rounded-lg hover:bg-primary-400 transition-all duration-200"
                              >
                                복사
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fileResults.length > 0 && (
              <div className="w-full pt-4 border-t border-stroke-base-200">
                <div className="flex justify-center gap-6 text-body-l">
                  <span className="text-primary-600">
                    성공: {fileResults.filter(f => f.status === 'success').length}개
                  </span>
                  <span className="text-error-500">
                    실패: {fileResults.filter(f => f.status === 'error').length}개
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200"
          >
            확인
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};