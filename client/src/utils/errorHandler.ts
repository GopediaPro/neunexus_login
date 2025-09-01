import { toast } from "sonner";

export type ErrorType = 'network' | 'validation' | 'permission' | 'server' | 'unknown';

interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: any;
}

const ERROR_MESSAGES = {
  400: '잘못된 요청입니다.',
  401: '인증이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  409: '데이터 충돌이 발생했습니다.',
  422: '입력 데이터가 올바르지 않습니다.',
  500: '서버에서 오류가 발생했습니다.',
  502: '서버 연결에 문제가 있습니다.',
  503: '서버가 일시적으로 이용할 수 없습니다.',
};

const DEFAULT_MESSAGES = {
  network: '네트워크 연결을 확인해주세요.',
  validation: '입력한 정보를 다시 확인해주세요.',
  permission: '해당 작업을 수행할 권한이 없습니다.',
  server: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  unknown: '알 수 없는 오류가 발생했습니다.',
};

export const analyzeError = (error: any): ErrorInfo => {
  if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return {
      type: 'network',
      message: DEFAULT_MESSAGES.network,
      originalError: error
    };
  }

  if (error.response) {
    const status = error.response.status;
    const serverMessage = error.response.data?.message;
    
    if (status >= 400 && status < 500) {
      return {
        type: status === 422 ? 'validation' : 'permission',
        message: serverMessage || ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] || DEFAULT_MESSAGES.validation,
        originalError: error
      };
    }
    
    if (status >= 500) {
      return {
        type: 'server',
        message: ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] || DEFAULT_MESSAGES.server,
        originalError: error
      };
    }
  }

  if (error.message) {
    return {
      type: 'unknown',
      message: error.message,
      originalError: error
    };
  }

  return {
    type: 'unknown',
    message: DEFAULT_MESSAGES.unknown,
    originalError: error
  };
};

export const handleError = (error: any, context?: string) => {
  const errorInfo = analyzeError(error);
  
  console.error(`Error in ${context || 'unknown context'}:`, {
    type: errorInfo.type,
    message: errorInfo.message,
    originalError: errorInfo.originalError
  });

  toast.error(errorInfo.message);

  return errorInfo;
};

export const handleOrderError = (error: any, action: string) => {
  const contextMessage = `주문 ${action}`;
  return handleError(error, contextMessage);
};

export const handleDeleteError = (error: any, deleteType: string) => {
  const contextMessage = `${deleteType} 삭제`;
  return handleError(error, contextMessage);
};

export const handleUploadError = (error: any) => {
  return handleError(error, '파일 업로드');
};

export const handleSuccess = (message: string) => {
  toast.dismiss();
  toast.success(message);
};