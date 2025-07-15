import { Button } from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

interface ViewAllButtonProps {
  text?: string;
  onClick?: () => void;
}

export const ViewAllButton = ({ 
  text = "전체보기", 
  onClick, 
}: ViewAllButtonProps) => {
  let textWidth = '';
  if (text.split('').length === 2) textWidth = 'w-16 h-7';
  else if (text.split('').length === 3) textWidth = 'w-18 h-7';
  else if (text.split('').length === 4) textWidth = 'w-22 h-7';

  return (
    <Button
      onClick={onClick}
      variant="light"
      size="view"
      className={`${textWidth} flex items-center gap-2 text-text-base-400 hover:text-text-base-500 transition-colors border border-stroke-base-100 pl-3`}
    >
      <span>
        {text}
      </span>
      <ChevronRight size={16} strokeWidth={2} className="text-[#555]" />
    </Button>
  );
};