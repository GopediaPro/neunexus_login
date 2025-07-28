import { Modal } from '../Modal';
import { Button } from '../Button';
import type { BatchInfoData, BatchInfoResponse } from '@/shared/types';
import { convertToHttps } from '@/utils/convertToHttps';
import { Icon } from '../Icon';
import { formatDate } from '@/utils/formatDate';

interface BatchInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchInfo: BatchInfoResponse | null;
}

export const BatchInfoModal = ({
  isOpen,
  onClose,
  batchInfo,
}: BatchInfoModalProps) => {
  if (!batchInfo) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const handleDownload = (fileUrl: string) => {
    const httpsUrl = convertToHttps(fileUrl);
    window.open(httpsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>
        <Modal.Title>배치 정보 조회</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      
      <Modal.Body>
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between p-4 bg-fill-alt-50 rounded-lg">
            <div className="text-body-s text-text-base-400">
              총 <span className="font-semibold text-text-base-500">{batchInfo.total}</span>개의 배치 정보
              <span className="text-text-base-300 ml-2">
                (페이지 {batchInfo.page}/{Math.ceil(batchInfo.total / batchInfo.page_size)})
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 max-h-[35rem] overflow-y-auto overflow-x-hidden w-full">
            {batchInfo.items.map((item, itemIndex) => (
              <div className="flex flex-col gap-4" key={itemIndex}>
                {item.data.map((batch: BatchInfoData) => (
                  <div key={batch.batch_id}>
                    <h2 className="text-body-l text-text-base-500 pb-2">
                      {formatDate(batch.created_at)}
                    </h2>
                    <div className="p-4 border-2 border-stroke-base-100 rounded-lg bg-fill-base-50 relative">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name="document" style="w-8 h-8 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-body-l text-text-base-700 mb-2">
                            {batch.original_filename}
                          </h3>
                          <div className="flex items-center gap-4 text-text-base-500">
                            <span>{formatFileSize(batch.file_size)}</span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${batch.error_message ? 'bg-error-500' : 'bg-green-400'}`}></div>
                              <span className={batch.error_message ? 'text-error-500' : 'text-green-500'}>
                                {batch.error_message ? '오류' : '정상'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex">
                          <span className="text-text-base-500 pr-2">배치 ID :</span>
                          <span className="text-text-base-700">{batch.batch_id}</span>
                        </div>
                        
                        <div className="flex">
                          <span className="text-text-base-500 pr-2">파일 생성자 :</span>
                          <span className="text-text-base-700">{batch.created_by}</span>
                        </div>
                        
                        {batch.date_from && batch.date_to && (
                          <div className="flex">
                            <span className="text-text-base-500 pr-2">주문 기간 :</span>
                            <div className="text-text-base-700">
                              <div>{formatDateTime(batch.date_from)} ~</div>
                              <div>{formatDateTime(batch.date_to)}</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex">
                          <span className="text-text-base-500 pr-2">최근 수정일 :</span>
                          <span className="text-text-base-700">{formatDateTime(batch.updated_at)}</span>
                        </div>
                      </div>
                      
                      {batch.error_message && (
                        <div className="mb-6 p-3 bg-fill-alt-50 border border-stroke-base-100 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Icon name="alert" style="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-body-s text-text-base-700 mb-1">오류 메시지</div>
                              <div className="text-body-s text-text-base-500">{batch.error_message}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-3 justify-end">
                        <Button
                          size="default"
                          variant="light"
                          onClick={() => window.open(batch.file_url, '_blank')}
                          disabled={!batch.file_url || batch.file_url.trim() === ''}
                          className="px-6 py-2"
                        >
                          미리보기
                        </Button>
                        <Button
                          size="default"
                          variant="light"
                          onClick={() => handleDownload(batch.file_url)}
                          disabled={!batch.file_url || batch.file_url.trim() === ''}
                          className="px-6 py-2"
                        >
                          파일 다운로드
                        </Button>
                      </div>
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