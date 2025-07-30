import { StatusCard } from '@/components/mainpage/common/StatusCard';
import { salesData } from '@/mocks/dummy/status';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusTable } from '../common/StatusTable';

export const SalesStatus = () => {
  const [activeTab, setActiveTab] = useState('금일');
  const tabs = ['금일', '월별', '전일자'];
  const navigate = useNavigate();

  const columns = [
    { key: 'productCode', label: '품목코드', align: 'left' as const },
    {
      key: 'quantity',
      label: '재고수량',
      align: 'center' as const,
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'amount',
      label: '재고금액',
      align: 'right' as const,
      render: (value: number) => value.toLocaleString()
    }
  ];

  return (
    <StatusCard title="판매현황" onViewAll={() => navigate('/')}>
      <div className="flex space-x-2 py-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-0.5 text-body-s border border-stroke-base-100 rounded ${
              activeTab === tab
                ? 'bg-fill-alt-200 text-primary-500'
                : 'bg-fill-base-100 text-text-base-400 hover:bg-fill-alt-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-2">
        <StatusTable columns={columns} data={salesData} />
      </div>
    </StatusCard>
  );
};
