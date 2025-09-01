import { useCallback, useState } from "react"

type ModalState = {
  orderRegister: boolean;
  batchInfo: boolean;
  confirmDelete: boolean;
  excelBulk: boolean;
  smileMacro: boolean;
}

type ModalType = keyof ModalState;

export const useModalStates = () => {
  const [modals, setModals] = useState<ModalState>({
    orderRegister: false,
    batchInfo: false,
    confirmDelete: false,
    excelBulk: false,
    smileMacro: false,
  });

  const openModal = useCallback((modalType: ModalType) => {
    setModals(prev => ({ ...prev, [modalType]: true }))
  }, []);

  const closeModal = useCallback((modalType: ModalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({
      orderRegister: false,
      batchInfo: false,
      confirmDelete: false,
      excelBulk: false,
      smileMacro: false,
    });
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
}