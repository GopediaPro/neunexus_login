import { useState } from 'react';
import { StatusCard } from '@/components/mainpage/common/StatusCard';
import { useNavigate } from 'react-router-dom';
import { Toggle } from '@/components/ui/Toggle';

interface AutomationItem {
  id: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}

const automationItems: AutomationItem[] = [
  {
    id: 'auto-stock-1',
    title: '자동 재고 관리',
    description: '예시 설명 텍스트',
    defaultChecked: true
  },
  {
    id: 'auto-stock-2',
    title: '자동 발주 시스템',
    description: '예시 설명 텍스트',
    defaultChecked: true
  },
  {
    id: 'auto-stock-3',
    title: '유통기한 경고',
    description: '예시 설명 텍스트',
    defaultChecked: false
  }
];

export const AutomationContainer = () => {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(
      automationItems.map((item) => [item.id, item.defaultChecked])
    )
  );

  const handleToggleChange = (id: string, checked: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: checked }));
  };

  return (
    <div className='flex-1 border border-border-default rounded-[10px] overflow-hidden'>
      <StatusCard title="자동화 현황" onViewAll={() => navigate('/')}>
        <div className="flex flex-col gap-3 py-3">
          {automationItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center w-full"
            >
              <div className="flex flex-col justify-center">
                <div className="text-sm font-semibold text-neutral-600">
                  {item.title}
                </div>
                <div className="text-xs font-medium text-neutral-500">
                  {item.description}
                </div>
              </div>
              <Toggle
                size="sm"
                checked={toggles[item.id]}
                onCheckedChange={(checked) =>
                  handleToggleChange(item.id, checked)
                }
              />
            </div>
          ))}
        </div>
      </StatusCard>
    </div>
  );
};
