import { Modal } from '.';
import { Button } from '../Button';
import type { BatchInfoData, BatchInfoResponse } from '@/shared/types';

interface BatchInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchInfo: BatchInfoResponse | null;
}

export const BatchInfoAllModal = ({
  isOpen,
  onClose,
  batchInfo
}: BatchInfoModalProps) => {
  if (!batchInfo) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <Modal.Title>배치 정보 조회</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      
      <Modal.Body>
        <div className="space-y-4">
          <div className="text-body-s text-text-base-400">
            총 {batchInfo.total}개의 배치 정보 (페이지 {batchInfo.page}/{Math.ceil(batchInfo.total / batchInfo.page_size)})
          </div>
          
          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
            {batchInfo.items.map((item, itemIndex) => (
              <div key={itemIndex}>
                {item.data.map((batch: BatchInfoData) => (
                  <div 
                    key={batch.batch_id} 
                    className="p-4 border border-stroke-base-100 rounded-lg bg-fill-alt-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-body-s text-text-base-500">
                          배치 ID: {batch.batch_id}
                        </h3>
                        <p className="text-body-s text-text-base-400">
                          생성자: {batch.created_by}
                        </p>
                      </div>
                      <div className="text-right text-body-s text-text-base-300">
                        <div>생성: {formatDate(batch.created_at)}</div>
                        <div>수정: {formatDate(batch.updated_at)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-body-s">
                      <div>
                        <span className="font-medium">원본 파일명:</span>
                        <p className="text-text-base-400">{batch.original_filename}</p>
                      </div>
                      <div>
                        <span className="font-medium">파일 크기:</span>
                        <p className="text-text-base-400">{formatFileSize(batch.file_size)}</p>
                      </div>
                      <div>
                        <span className="font-medium">주문 기간:</span>
                        <p className="text-text-base-400">
                          {formatDate(batch.order_date_from)} ~ {formatDate(batch.order_date_to)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">상태:</span>
                        <p className={`${batch.error_message ? 'text-text-error-500' : 'text-text-success-500'}`}>
                          {batch.error_message ? '오류' : '정상'}
                        </p>
                      </div>
                    </div>
                    
                    {batch.error_message && (
                      <div className="mt-3 p-2 bg-fill-error-100 border border-stroke-error-100 rounded">
                          <span className="text-body-s font-medium text-text-error-500">오류 메시지:</span>
                        <p className="text-body-s text-text-error-500">{batch.error_message}</p>
                      </div>
                    )}
                    
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="compact"
                        onClick={() => handleDownload(batch.file_url, batch.original_filename)}
                      >
                        파일 다운로드
                      </Button>
                      <Button
                        size="compact"
                        onClick={() => window.open(batch.file_url, '_blank')}
                      >
                        파일 보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="light" onClick={onClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};