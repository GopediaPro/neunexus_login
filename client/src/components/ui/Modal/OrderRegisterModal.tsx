import type { OrderRegisterForm } from "@/shared/types";
import { useForm, Controller } from "react-hook-form";
import { SelectSearchInput } from "@/components/management/common/SelectSearchInput";
import { templateOptions } from "@/constant";
import { Button } from "@/components/ui/Button";
import { Modal } from ".";
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle } from "./ModalLayout";

interface OrderRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderRegisterForm) => void;
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
    reset,
    watch
  } = useForm<OrderRegisterForm>({
    defaultValues: {
      selectedTemplate: '',
      orderData: {}
    }
  });

  const selectedTemplate = watch('selectedTemplate');

  const handleFormSubmit = (data: OrderRegisterForm) => {
    onSubmit(data);
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
        <ModalCloseButton />
      </ModalHeader>

      <ModalBody className="h-[300px]">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-base-500">
              템플릿 선택 <span className="text-red-500">*</span>
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
              <p className="text-sm text-red-500">{errors.selectedTemplate.message}</p>
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
          onClick={handleSubmit(handleFormSubmit)}
          disabled={!selectedTemplate}
        >
          등록
        </Button>
      </ModalFooter>
    </Modal>
  );
};