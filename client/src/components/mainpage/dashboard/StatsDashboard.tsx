import { Icon } from "@/components/ui/Icon";
import { statsData } from "@/mocks/dummy/stats";

interface StatsItemProps {
  iconName: string;
  value: string | number;
  label: string;
}

const StatsItem = ({ iconName, value, label }: StatsItemProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-page-blue-300 rounded-full flex items-center justify-center">
        <Icon name={iconName} style="w-5 h-5 text-page-blue-400" />
      </div>
      <div className="text-white">
        <div className="text-center text-lg font-bold leading-tight">{value.toLocaleString()}</div>
        <div className="text-sm text-white/90">{label}</div>
      </div>
    </div>
  );
};

export const StatsDashboard = () => {
  const statsItems = [
    { iconName: 'cart-circle', label: '신규주문' },
    { iconName: 'document', label: '주문확인' },
    { iconName: 'x-circle', label: '송장 미전송' },
    { iconName: 'check-circle', label: '송장 전송' }
  ];

  return (
    <div className="bg-page-blue-400 rounded-[10px] p-2 px-16">
      <div className="flex justify-between cursor-pointer">
        {statsItems.map((item, index) => (
          <StatsItem
            key={item.label}
            iconName={item.iconName}
            value={statsData[index]?.value || 0}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
};