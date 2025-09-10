import { useState, useCallback } from 'react';

type ModalType = 'orderRegister' | 'batchInfo' | 'confirmDelete' | 'excelBulk' | 'smileMacro' | 'dbToExcel' | 'excelToDb' | 'ecountErpTransfer' | 'ecountUpload';

export const useModals = () => {
  const [modals, setModals] = useState({
    orderRegister: false,
    batchInfo: false,
    confirmDelete: false,
    excelBulk: false,
    smileMacro: false,
    dbToExcel: false,
    excelToDb: false,
    ecountErpTransfer: false,
    ecountUpload: false,
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