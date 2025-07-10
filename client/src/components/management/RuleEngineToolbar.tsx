import React, { useState } from 'react';

export const RuleEngineToolbar = () => {
  const [activeTab, setActiveTab] = useState<'product' | 'order'>('product');

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-white border rounded">
      {/* 왼쪽 탭 */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('product')}
          className={`px-4 py-1 border rounded font-medium ${
            activeTab === 'product'
              ? 'border-blue-500 text-blue-500 bg-blue-50'
              : 'text-gray-400'
          }`}
        >
          상품관리
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`px-4 py-1 border rounded font-medium ${
            activeTab === 'order'
              ? 'border-blue-500 text-blue-500 bg-blue-50'
              : 'text-gray-400'
          }`}
        >
          주문관리
        </button>
      </div>

      {/* 오른쪽 상태 */}
      <div className="flex items-center gap-4 text-sm">
        <StatusIndicator label="DB 연결상태" />
        <StatusIndicator label="룰 엔진 작동상태" />
        <StatusIndicator label="캐시서버상태" />
      </div>
    </div>
  );
};

const StatusIndicator = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1">
    <span className="w-2 h-2 rounded-full bg-green-500" />
    <span>{label}</span>
  </div>
);
