import { ViewAllButton } from "@/components/mainpage/common/ViewAllButton";

interface StatusCardProps {
  title: string;
  onViewAll?: () => void;
  viewAllText?: string;
  children: React.ReactNode;
  className?: string;
}

export const StatusCard = ({ 
  title, 
  onViewAll, 
  viewAllText,
  children, 
  className
}: StatusCardProps) => {
  return (
    <div className={`bg-fill-base-100 p-4 ${className}`}>
      <div className={`flex items-center justify-between ${title === "조직도" ? "" : "border-b border-stroke-base-100"} pb-3`}>
        <h3 className="text-h4 text-text-base-500">{title}</h3>
        {onViewAll && (
          <ViewAllButton
            text={viewAllText}
            onClick={onViewAll}
          />
        )}
      </div>
      {children}
    </div>
  );
};