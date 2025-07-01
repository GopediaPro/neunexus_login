import { Icon } from "@/components/ui/Icon";
import { statsItems } from "@/constant/dashboard";
import { statsData } from "@/mocks/dummy/stats";

interface StatsItemProps {
  iconName: string;
  value: string | number;
  label: string;
}

const StatsItem = ({ iconName, value, label }: StatsItemProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center">
        <Icon name={iconName} style={`${iconName === 'document' ? 'w-4 h-4' : 'w-5 h-5 '} text-white`} />
      </div>
      <div className="text-white">
        <div className="text-center text-lg font-bold leading-tight">{value.toLocaleString()}</div>
        <div className="text-sm text-white/90">{label}</div>
      </div>
    </div>
  );
};

export const StatsDashboard = () => {

  return (
    <div className="bg-page-blue-400 rounded-[10px] p-2 px-16">
      <div className="flex justify-between 2xl:justify-center 2xl:gap-20 cursor-pointer">
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