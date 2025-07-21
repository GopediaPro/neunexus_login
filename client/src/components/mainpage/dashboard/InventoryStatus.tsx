import { StatusCard } from '@/components/mainpage/common/StatusCard';
import { inventoryData } from '@/mocks/dummy/status';
import { useNavigate } from 'react-router-dom';
import { StatusTable } from '../common/StatusTable';

export const InventoryStatus = () => {
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
    <StatusCard title="재고현황" onViewAll={() => navigate('/')}>
      <div className="py-2">
        <StatusTable columns={columns} data={inventoryData} height="h-64" />
      </div>
    </StatusCard>
  );
};
