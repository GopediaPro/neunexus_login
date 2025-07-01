import { useEffect, type ReactNode } from "react";
import { Portal } from "./Portal";
import { ModalProvider } from "@/contexts";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' ;
}

export const ModalRoot = ({ children, isOpen, onClose, size }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  const getSizeClass = () => {
    const sizeMap = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl' 
    };
    return sizeMap[size];
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <ModalProvider isOpen={isOpen} onClose={onClose}>
      <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div 
            className={`bg-page-bg rounded-lg shadow-xl ${getSizeClass()} w-full max-h-[90vh] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </ModalProvider>
    </Portal>
  )
}