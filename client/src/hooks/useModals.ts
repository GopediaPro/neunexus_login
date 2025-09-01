import { useState, useCallback } from 'react';

type ModalType = 'orderRegister' | 'batchInfo' | 'confirmDelete' | 'excelBulk' | 'smileMacro';

export const useModals = () => {
  const [modals, setModals] = useState({
    orderRegister: false,
    batchInfo: false,
    confirmDelete: false,
    excelBulk: false,
    smileMacro: false,
  });

  const openModal = useCallback((modalType: ModalType) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  }, []);

  const closeModal = useCallback((modalType: ModalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  }, []);

  return {
    modals,
    openModal,
    closeModal,
  };
};