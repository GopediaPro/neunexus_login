import { useState } from 'react';

interface FileResult {
  name: string;
  url?: string;
  status: 'success' | 'error';
}

interface BulkResult {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  fileResults: FileResult[];
}

export const useBulkResult = () => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);

  const showResult = (result: BulkResult) => {
    setBulkResult(result);
    setShowResultModal(true);
  };

  const hideResult = () => {
    setShowResultModal(false);
    setBulkResult(null);
  };

  const createSuccessResult = (
    title: string,
    message: string,
    fileResults: FileResult[]
  ): BulkResult => ({
    type: 'success',
    title,
    message,
    fileResults
  });

  const createErrorResult = (
    title: string,
    message: string,
    fileResults: FileResult[] = []
  ): BulkResult => ({
    type: 'error',
    title,
    message,
    fileResults
  });

  return {
    showResultModal,
    bulkResult,
    showResult,
    hideResult,
    createSuccessResult,
    createErrorResult
  };
};