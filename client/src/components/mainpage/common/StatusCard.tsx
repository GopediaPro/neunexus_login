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
    <div className={`bg-white p-4 ${className}`}>
      <div className={`flex items-center justify-between ${title === "조직도" ? "" : "border-b border-border-default"} pb-3`}>
        <h3 className="text-lg font-medium text-page-font-primary">{title}</h3>
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