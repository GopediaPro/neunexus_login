import { useForm, Controller } from "react-hook-form";
import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { templateOptions } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Modal } from "../ModalComponent";
import { ModalBody, ModalFooter, ModalHeader, ModalTitle } from "../ModalComponent/ModalLayout";
import { toast } from "sonner";

interface OrderFormData {
  selectedTemplate: string;
}

interface OrderRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedTemplate: string) => void;
}

export const OrderRegisterModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: OrderRegisterModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<OrderFormData>({
    defaultValues: {
      selectedTemplate: '',
    }
  });

  const handleFormSubmit = (data: OrderFormData) => {
    if (!data.selectedTemplate) {
      toast.error('템플릿을 선택해주세요.');
      return;
    }

    onSubmit(data.selectedTemplate);
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader>
        <ModalTitle>주문 등록</ModalTitle>
      </ModalHeader>

      <ModalBody className="h-[300px]">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-body-s text-text-base-500">
              템플릿 선택 <span className="text-error-500">*</span>
            </label>
            <Controller
              name="selectedTemplate"
              control={control}
              rules={{ required: '템플릿을 선택해주세요' }}
              render={({ field }) => (
                <SelectSearchInput
                  options={templateOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="템플릿을 선택하세요"
                />
              )}
            />
            {errors.selectedTemplate && (
              <p className="text-sm text-error-500">{errors.selectedTemplate.message}</p>
            )}
          </div>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button
          type="button"
          variant="light"
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSubmit(handleFormSubmit)}
        >
          등록
        </Button>
      </ModalFooter>
    </Modal>
  );
};