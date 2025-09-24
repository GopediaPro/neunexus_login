import { Icon } from "@/components/ui/Icon";
import { statsItems } from "@/constants/dashboard";
import { statsData } from "@/mocks/dummy/stats";

interface StatsItemProps {
  iconName: string;
  value: string | number;
  label: string;
}

const StatsItem = ({ iconName, value, label }: StatsItemProps) => {
  const getIconSize = (name: string) => {
    switch (name) {
      case 'x':
      case 'close':
        return 'w-6 h-6';
      case 'document':
        return 'w-4 h-4';
      case 'check':
      case 'checkmark':
        return 'w-5 h-5';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center">
        <Icon name={iconName} style={`${getIconSize(iconName)} text-white`} />
      </div>
      <div className="text-white">
        <div className="text-center text-h5 leading-tight">{value.toLocaleString()}</div>
        <div className="text-h6 text-text-contrast-500">{label}</div>
      </div>
    </div>
  );
};

export const StatsDashboard = () => {

  return (
    <div className="bg-primary-500 rounded-md p-2 px-16 py-3">
      <div className="flex justify-center gap-16 cursor-pointer">
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