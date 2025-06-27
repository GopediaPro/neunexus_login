import { useEffect, type ReactNode } from "react";
import { Portal } from "./Portal";
import { ModalProvider } from "@/contexts";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const ModalRoot = ({ children, isOpen, onClose }: ModalProps) => {
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


  if (!isOpen) return null;

  return (
    <Portal>
      <ModalProvider isOpen={isOpen} onClose={onClose}>
      <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div 
            className="bg-web-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </ModalProvider>
    </Portal>
  )
}