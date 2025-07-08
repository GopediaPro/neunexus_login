import { ModalRoot } from "./Modal";
import { ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle } from "./ModalLayout";

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  CloseButton: ModalCloseButton,
  Body: ModalBody,
  Footer: ModalFooter
});