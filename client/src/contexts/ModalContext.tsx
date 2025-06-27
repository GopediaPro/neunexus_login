import { createContext, useContext, type ReactNode } from "react";

interface ModalContextProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalProviderProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) return;

  return context;
}

export const ModalProvider = ({ children, isOpen, onClose }: ModalProviderProps) => {
  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      {children}
    </ModalContext.Provider>
  );
}