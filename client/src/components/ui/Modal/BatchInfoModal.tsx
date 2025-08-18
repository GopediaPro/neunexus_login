import { Modal } from '../Modal';
import { Button } from '../Button';
import type { BatchInfoData, BatchInfoResponse } from '@/shared/types';
import { convertToHttps } from '@/utils/convertToHttps';
import { Icon } from '../Icon';
import { formatDate } from '@/utils/formatDate';
import { Checkbox } from '../Checkbox';
import { useEffect, useMemo, useState } from 'react';
import { FORM_TYPE_OPTIONS, STATUS_OPTIONS } from '@/constant/order';
import { Dropdown } from '../Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface BatchInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchInfo: BatchInfoResponse | null;
}

type FilterFormType = string;
type FilterStatus = 'all' | 'success' | 'error';

export const BatchInfoModal = ({
  isOpen,
  onClose,
  batchInfo,
}: BatchInfoModalProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [filterFormType, setFilterFormType] = useState<FilterFormType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('success');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedItems(new Set());
      setFilterFormType('all');
      setFilterStatus('success');
      setStartDate(null);
      setEndDate(null);
    }
  }, [isOpen]);

  const allBatches = useMemo(() => {
    if (!batchInfo) return [];
    return batchInfo.items.flatMap(item => item.data);
  }, [batchInfo]);

  const filteredBatches = useMemo(() => {
    return allBatches.filter(batch => {
      let formType = 'unknown';
      if (batch.file_url) {
        if (batch.file_url.includes('/basic_erp/')) formType = 'basic_erp';
        else if (batch.file_url.includes('/gmarket_erp/')) formType = 'gmarket_erp';
        else if (batch.file_url.includes('/brandi_erp/')) formType = 'brandi_erp';
        else if (batch.file_url.includes('/basic_bundle/')) formType = 'basic_bundle';
        else if (batch.file_url.includes('/gmarket_bundle/')) formType = 'gmarket_bundle';
      }
      
      if (filterFormType !== 'all' && formType !== filterFormType) return false;
      
      if (filterStatus === 'success' && batch.error_message) return false;
      if (filterStatus === 'error' && !batch.error_message) return false;
      
      // 날짜 필터링
      if (startDate || endDate) {
        const batchDate = new Date(batch.created_at);
        if (startDate && batchDate < startDate) return false;
        if (endDate && batchDate > endDate) return false;
      }
      return true;
    });
  }, [allBatches, filterFormType, filterStatus, startDate, endDate]);

  const groupedBatches = useMemo(() => {
    const groups: { [key: string]: BatchInfoData[] } = {};
    
    filteredBatches.forEach(batch => {
      const dateKey = formatDate(batch.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(batch);
    });
    
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredBatches]);

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

  const toggleSelectItem = (batchId: number) => {
    const newSelectedItems = new Set(selectedItems);
    if (selectedItems.has(batchId)) {
      newSelectedItems.delete(batchId);
    } else {
      newSelectedItems.add(batchId);
    }
    setSelectedItems(newSelectedItems);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredBatches.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredBatches.map(batch => batch.batch_id)));
    }
  };

  const handleBatchDownload = () => {
    const selectedBatches = filteredBatches.filter(batch => 
      selectedItems.has(batch.batch_id) && batch.file_url
    );
    
    selectedBatches.forEach(batch => {
      handleDownload(batch.file_url);
    });
  };


  const resetFilters = () => {
    setFilterFormType('all');
    setFilterStatus('all');
    setStartDate(null);
    setEndDate(null);
    setSelectedItems(new Set());
  };

  const currentFormTypeLabel = FORM_TYPE_OPTIONS.find(option => option.value === filterFormType)?.label || '전체';
  const currentStatusLabel = STATUS_OPTIONS.find(option => option.value === filterStatus)?.label || '전체';


  const getFormTypeFromUrl = (fileUrl: string | null): string => {
    if (!fileUrl) return 'Unknown';
    if (fileUrl.includes('/basic_erp/')) return 'Basic ERP';
    if (fileUrl.includes('/gmarket_erp/')) return 'G마켓 ERP';
    if (fileUrl.includes('/brandi_erp/')) return 'Brandi ERP';
    if (fileUrl.includes('/basic_bundle/')) return 'Basic Bundle';
    if (fileUrl.includes('/gmarket_bundle/')) return 'G마켓 Bundle';
    return 'Unknown';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <Modal.Header>
        <Modal.Title>배치 정보 조회</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      
      <Modal.Body>
        <div className="space-y-4 w-full">
          <div className="p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-200">
            <div className="flex items-center gap-4 flex-nowrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">폼 타입:</span>
                <Dropdown
                  trigger={
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 cursor-pointer min-w-[120px]">
                      <span className="flex-1">{currentFormTypeLabel}</span>
                      <Icon name="chevron-down" style="w-4 h-4 text-gray-500" />
                    </div>
                  }
                  items={FORM_TYPE_OPTIONS.map(option => ({
                    label: option.label,
                    onClick: () => setFilterFormType(option.value)
                  }))}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">상태:</span>
                <Dropdown
                  trigger={
                    <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 cursor-pointer min-w-[80px]">
                      <span className="flex-1">{currentStatusLabel}</span>
                      <Icon name="chevron-down" style="w-4 h-4 text-gray-500" />
                    </div>
                  }
                  items={STATUS_OPTIONS.map(option => ({
                    label: option.label,
                    onClick: () => setFilterStatus(option.value as FilterStatus)
                  }))}
                />
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600 whitespace-nowrap">생성일:</span>
                <div className="flex gap-1 items-center">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="0000-00-00"
                    dateFormat="yyyy-MM-dd"
                    formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    todayButton="Today"

                    className="px-3 py-2 w-32 h-10 text-sm bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-400">~</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    // minDate={startDate}
                    placeholderText="0000-00-00"
                    dateFormat="yyyy-MM-dd"
                    formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    todayButton="Today"

                    className="px-3 py-2 w-32 h-10 text-sm bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <Button variant="light" onClick={resetFilters}>
                필터 초기화
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                총 <span className="font-semibold text-gray-700">{filteredBatches.length}</span>개의 배치 정보
                {filteredBatches.length !== batchInfo.total && (
                  <span className="text-gray-400 ml-2">
                    (전체 {batchInfo.total}개 중 필터링됨)
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {selectedItems.size > 0 && (
                  <Button 
                    variant="light" 
                    onClick={handleBatchDownload}
                    className="flex items-center gap-2"
                  >
                    선택한 파일 다운로드 ({selectedItems.size}개)
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.size === filteredBatches.length && filteredBatches.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm text-gray-600">전체 선택</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 max-h-[40rem] overflow-y-auto overflow-x-hidden w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredBatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                필터 조건에 맞는 배치 정보가 없습니다.
              </div>
            ) : (
              groupedBatches.map(([date, batches]) => (
                <div key={date} className="space-y-3">
                  <h2 className="text-lg text-gray-700 pb-2 border-b border-gray-200">
                    {date} ({batches.length}건)
                  </h2>
                  
                  {batches.map((batch: BatchInfoData) => (
                    <div key={batch.batch_id}
                      onClick={() => toggleSelectItem(batch.batch_id)}
                      className={`p-4 border-2 rounded-lg relative transition-colors duration-200 cursor-pointer ${
                      selectedItems.has(batch.batch_id) 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}>
                      <div className="absolute top-4 left-4">
                        <Checkbox
                          checked={selectedItems.has(batch.batch_id)}
                          onCheckedChange={() => toggleSelectItem(batch.batch_id)}
                        />
                      </div>

                      <div className="flex items-start gap-4 mb-6 ml-10">
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          batch.error_message ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <Icon 
                            name={batch.error_message ? "alert" : "document"} 
                            style={`w-8 h-8 ${batch.error_message ? 'text-red-600' : 'text-blue-600'}`} 
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg text-gray-900 mb-2">
                            {batch.original_filename}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-600 flex-wrap">
                            <span>{formatFileSize(batch.file_size)}</span>
                            <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                              {getFormTypeFromUrl(batch.file_url)}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${batch.error_message ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              <span className={batch.error_message ? 'text-red-600' : 'text-green-600'}>
                                {batch.error_message ? '실패' : '성공'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 ml-10 text-sm">
                        <div className="space-y-2">
                          <div className="flex">
                            <span className="text-gray-600 pr-2 min-w-[80px]">배치 ID:</span>
                            <span className="text-gray-800">{batch.batch_id}</span>
                          </div>
                          
                          <div className="flex">
                            <span className="text-gray-600 pr-2 min-w-[80px]">생성자:</span>
                            <span className="text-gray-800">{batch.created_by}</span>
                          </div>
                          
                          {batch.date_from && batch.date_to && (
                            <div className="flex">
                              <span className="text-gray-600 pr-2 min-w-[80px]">주문 기간:</span>
                              <div className="text-gray-800">
                                <div>{formatDateTime(batch.date_from)} ~</div>
                                <div>{formatDateTime(batch.date_to)}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex">
                            <span className="text-gray-600 pr-2 min-w-[80px]">생성일:</span>
                            <span className="text-gray-800">{formatDateTime(batch.created_at)}</span>
                          </div>
                          
                          <div className="flex">
                            <span className="text-gray-600 pr-2 min-w-[80px]">수정일:</span>
                            <span className="text-gray-800">{formatDateTime(batch.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {batch.error_message && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg ml-10">
                          <div className="flex items-start gap-2">
                            <Icon name="alert" style="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-red-700 mb-1">오류 메시지</div>
                              <div className="text-sm text-red-600 max-h-20 overflow-y-auto">
                                {batch.error_message}
                              </div>
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
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-500">
            {selectedItems.size > 0 && `${selectedItems.size}개 항목이 선택됨`}
          </div>
          <Button variant="light" onClick={onClose}>
            닫기
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};