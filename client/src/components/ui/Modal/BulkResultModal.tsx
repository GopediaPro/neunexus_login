import { toast } from "sonner";
import { Modal } from "../ModalComponent";
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

  const handleCopyUrl = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('링크가 복사되었습니다.');
    } catch (error) {
      console.error('복사 실패:', error);
      toast.error('복사에 실패했습니다.');
    }
  };

  // const handleOpenUrl = () => {
  //   if (!url) return;
  //   window.open(url, '_blank');
  // };

  const colors = getThemeColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div />
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center justify-center px-6 py-8 gap-8">
          <div className="flex justify-center">
            <Icon name="upload-check" style="w-[100px] h-[100px] text-primary-500" />
          </div>

          <div className="flex flex-col items-center gap-10 w-full text-center">
            <h3 className="flex flex-col gap-1 w-full">
              <p className="text-h2 text-primary-500 font-bold">
                {title}
              </p>
              <p>
                {messages[0]}
              </p>
            </h3>
            <div className="flex items-center w-full gap-4 border-2 border-stroke-base-100 p-2 rounded-lg">
              <div className="bg-accent-blue-100 rounded-lg p-3">
                <Icon name="document" ariaLabel="document" style="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-body-l text-text-base-500 leading-relaxed whitespace-pre-line">
                  {messages[2]}
                </p>
                <p className="text-body-l text-text-base-500 leading-relaxed whitespace-pre-line">
                  {messages[3]}
                </p>
              </div>
            </div>
          </div>

          {url && (
            <div className={`w-full px-3 py-4 ${colors.bg} rounded-2xl space-y-4`}>
              <div className="text-left mb-2">
                <label className={`block text-body-l ${colors.accent} mb-2 flex items-center gap-2`}>
                  <Icon name="link-chain" ariaLabel="link-chain" style="w-5 h-5" />
                  {urlLabel}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 px-4 py-3 text-base bg-fill-base-100 rounded-xl text-text-base-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                  {showCopyButton && (
                    <Button
                      onClick={handleCopyUrl}
                      className="flex items-center w-20 bg-primary-300 text-body-l text-text-contrast-500 rounded-lg hover:bg-primary-400 transition-all duration-200"
                    >
                      복사
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};