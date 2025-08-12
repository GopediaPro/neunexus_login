import type { ReactNode } from "react";

export interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface ModalTitleProps {
  children: ReactNode;
  className?: string;
}

export interface ModalCloseButtonProps {
  className?: string;
}

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}