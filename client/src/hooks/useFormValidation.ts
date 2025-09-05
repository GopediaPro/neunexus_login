import { toast } from 'sonner';

interface FormValidationConfig {
  formName?: string;
  workStatus?: string;
  orderDateFrom?: string;
  orderDateTo?: string;
  templateCode?: string;
  file?: File | null;
}

export const useFormValidation = () => {
  const validateForm = (config: FormValidationConfig): boolean => {
    if (config.formName !== undefined && !config.formName.trim()) {
      toast.error('Form Name을 선택해주세요.');
      return false;
    }

    if (config.templateCode !== undefined && !config.templateCode.trim()) {
      toast.error('템플릿을 선택해주세요.');
      return false;
    }

    if (config.orderDateFrom && config.orderDateTo) {
      if (new Date(config.orderDateFrom) > new Date(config.orderDateTo)) {
        toast.error('시작 날짜는 종료 날짜보다 이전이어야 합니다.');
        return false;
      }
    }

    if (config.file === null) {
      toast.error('파일을 선택해주세요.');
      return false;
    }

    return true;
  };

  return { validateForm };
};
