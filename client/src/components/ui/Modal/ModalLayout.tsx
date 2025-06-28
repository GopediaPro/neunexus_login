import { useModalContext } from "@/contexts";
import type { ReactNode } from "react";

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

interface ModalTitleProps {
  children: ReactNode;
  className?: string;
}

interface ModalCloseButtonProps {
  className?: string;
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export const ModalHeader = ({ children, className }: ModalHeaderProps) => {
  return (
    <div className={`flex items-center justify-between p-3 ${className} `}>
      {children}
    </div>
  );
};

export const ModalTitle = ({ children, className }: ModalTitleProps) => {
  return (
    <h2 className={`text-xl font-semibold text-font-primary ${className}`}>
      {children}
    </h2>
  );
};

export const ModalCloseButton = ({ className }: ModalCloseButtonProps) => {
  const { onClose } = useModalContext();

  return (
    <button
      onClick={onClose}
      className={`text-font-tertiary hover:text-font-primary text-2xl leading-none transition-colors ${className}`}
      aria-label="모달 닫기"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="18" fill="#D9D9D9"/>
        <path d="M22.0928 11.8272C22.5291 11.3909 23.2365 11.3909 23.6728 11.8272C24.1091 12.2635 24.1091 12.971 23.6728 13.4073L19.0801 18L23.6728 22.5928C24.1091 23.0291 24.1091 23.7366 23.6728 24.1729C23.2365 24.6091 22.529 24.6091 22.0928 24.1729L17.5 19.5801L12.9072 24.1729L12.9062 24.1719C12.8793 24.1989 12.8522 24.2254 12.8232 24.2491L12.7324 24.3155C12.2986 24.6018 11.7092 24.5549 11.3271 24.1729C10.8909 23.7367 10.8911 23.0291 11.3271 22.5928L15.9199 18L11.3271 13.4073C10.891 12.971 10.891 12.2635 11.3271 11.8272C11.7634 11.391 12.4709 11.391 12.9072 11.8272L17.5 16.42L22.0928 11.8272ZM23.3193 23.8194L23.3896 23.7354C23.391 23.7334 23.3912 23.7305 23.3926 23.7285C23.371 23.7602 23.3474 23.7913 23.3193 23.8194ZM23.3193 13.0537L23.3896 12.9698C23.391 12.9678 23.3912 12.9649 23.3926 12.9629C23.371 12.9946 23.3474 13.0257 23.3193 13.0537Z" fill="#333333"/>
      </svg>
    </button>
  );
};

export const ModalBody = ({ children, className }: ModalBodyProps) => {
  return (
    <div className={`p-6 overflow-y-auto flex-1 ${className}`}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className }: ModalFooterProps) => {
  return (
    <div className={`flex items-center justify-end space-x-2 p-6 ${className}`}>
      {children}
    </div>
  );
};