import { toast } from "sonner";
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
        return <Icon name="check" ariaLabel="success" style="w-6 h-6 text-white" />;
      case 'error':
        return <Icon name="alert" ariaLabel="error" style="w-6 h-6 text-white" />;
      case 'warning':
        return <Icon name="alert" ariaLabel="warning" style="w-6 h-6 text-white" />;
      case 'info':
      default:
        return <Icon name="info" ariaLabel="info" style="w-6 h-6 text-white" />;
    }
  };

  const getIconBgGradient = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200/50';
      case 'error':
        return 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-200/50';
      case 'warning':
        return 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200/50';
      case 'info':
      default:
        return 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50';
    }
  };

  const getThemeColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50/80',
          border: 'border-emerald-200',
          text: 'text-emerald-900',
          accent: 'text-emerald-700',
          button: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
        };
      case 'error':
        return {
          bg: 'bg-rose-50/80',
          border: 'border-rose-200',
          text: 'text-rose-900',
          accent: 'text-rose-700',
          button: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/80',
          border: 'border-amber-200',
          text: 'text-amber-900',
          accent: 'text-amber-700',
          button: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
        };
      case 'info':
      default:
        return {
          bg: 'bg-indigo-50/80',
          border: 'border-indigo-200',
          text: 'text-indigo-900',
          accent: 'text-indigo-700',
          button: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
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

  const handleOpenUrl = () => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const colors = getThemeColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Body>
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className={`p-4 rounded-full ${getIconBgGradient()} transform transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
              {getIcon()}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-h3 text-text-base-400">
              {title}
            </h3>
            <p className="text-text-base-400 whitespace-pre-line leading-relaxed text-base">
              {message}
            </p>
          </div>
          
          {url && (
            <div className={`p-5 ${colors.bg} ${colors.border} border-2 rounded-2xl space-y-4 backdrop-blur-sm`}>
              <div className="text-left">
                <label className={`block text-sm font-semibold ${colors.accent} mb-3`}>
                  {urlLabel}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="w-full px-4 py-3 text-sm bg-white/90 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  {showCopyButton && (
                    <Button
                      onClick={handleCopyUrl}
                      variant="outline"
                      size="compact"
                      className="px-4 py-3 shrink-0 border-2 hover:bg-gray-50 transition-all duration-200"
                    >
                      복사
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={handleOpenUrl}
                  variant="default"
                  className={`flex items-center gap-2 px-8 py-3 ${colors.button} text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium`}
                >
                  <Icon name="redirect" ariaLabel="redirect" style="w-4 h-4" />
                  링크 열기
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer className="pt-6 border-t-0">
        <div className="flex justify-center w-full">
          <Button  
            onClick={onClose}
          >
            확인
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};