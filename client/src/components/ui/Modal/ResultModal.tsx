import { Modal } from ".";
import { Button } from "../Button";
import { Icon } from "../Icon";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  url?: string;
  urlLabel?: string;
  showCopyButton?: boolean;
}

export const ResultModal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  url,
  urlLabel = "결과 링크",
  showCopyButton = true
}: ResultModalProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icon name="check" ariaLabel="success" style="w-6 h-6 text-text-success-500" />;
      case 'error':
        return <Icon name="alert" ariaLabel="error" style="w-6 h-6 text-error-500" />;
      case 'warning':
        return <Icon name="alert" ariaLabel="warning" style="w-6 h-6 text-error-500" />;
      case 'info':
      default:
        return <Icon name="info" ariaLabel="info" style="w-6 h-6 text-primary-500" />;
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-fill-success-100';
      case 'error':
        return 'bg-fill-error-100';
      case 'warning':
        return 'bg-fill-warning-100';
      case 'info':
      default:
        return 'bg-primary-50';
    }
  };

  const handleCopyUrl = async () => {
    if (!url) return;
    
    try {
      await navigator.clipboard.writeText(url);
      // toast.success('링크가 복사되었습니다.'); // 추후 toast 구현
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const handleOpenUrl = () => {
    if (!url) return;
    window.open(url, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <Modal.Title className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${getIconBgColor()}`}>
            {getIcon()}
          </div>
          {title}
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      
      <Modal.Body>
        <div className="space-y-4">
          <p className="text-text-base-500 whitespace-pre-line">
            {message}
          </p>
          
          {url && (
            <div className="space-y-3">
              <div className="p-3 bg-fill-alt-50 border border-stroke-base-100 rounded-md">
                <label className="block text-body-s text-text-base-500 mb-2">
                  {urlLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 p-2 text-body-s bg-fill-base-100 border border-stroke-base-100 rounded text-text-base-400"
                  />
                  {showCopyButton && (
                    <Button
                      size="compact"
                      onClick={handleCopyUrl}
                      className="shrink-0"
                    >
                      <Icon name="copy" ariaLabel="copy" style="w-4 h-4" />
                      복사
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="compact"
                  onClick={handleOpenUrl}
                  className="flex items-center gap-1"
                >
                  <Icon name="redirect" ariaLabel="redirect" style="w-4 h-4" />
                  링크 열기
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="default" onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};