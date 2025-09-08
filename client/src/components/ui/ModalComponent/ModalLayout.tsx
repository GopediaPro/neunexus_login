import { useModalContext } from "@/contexts";
import type { ModalBodyProps, ModalCloseButtonProps, ModalFooterProps, ModalHeaderProps, ModalTitleProps } from "@/api/types";
import { Icon } from "../Icon";

export const ModalHeader = ({ children, className }: ModalHeaderProps) => {
  return (
    <div className={`flex items-center justify-between px-6 py-4 bg-fill-base-100 ${className} `}>
      {children}
    </div>
  );
};

export const ModalTitle = ({ children, className }: ModalTitleProps) => {
  return (
    <h2 className={`text-xl font-semibold text-text-base-500 bg-fill-base-100 ${className}`}>
      {children}
    </h2>
  );
};

export const ModalCloseButton = ({ className }: ModalCloseButtonProps) => {
  const { onClose } = useModalContext();

  return (
    <button
      onClick={onClose}
      className={`leading-none transition-colors ${className}`}
      aria-label="모달 닫기"
    >
      <Icon name="close" style="w-9 h-9 text-text-base-300 hover:text-text-base-500" />
    </button>
  );
};

export const ModalBody = ({ children, className }: ModalBodyProps) => {
  return (
    <div className={`p-6 bg-fill-base-100 overflow-y-auto flex-1 ${className}`}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return (
    <div className={`flex items-center justify-end bg-fill-base-100 space-x-2 p-6 ${className}`}>
      {children}
    </div>
  );
};