interface ViewAllButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export const ViewAllButton = ({ 
  text = "전체보기", 
  onClick, 
  className
}: ViewAllButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-20 h-6 flex items-center gap-2 text-xs text-page-font-secondary hover:text-page-font-secondary transition-colors border rounded-[10px] border-border-default pl-3 ${className}`}
    >
      <span>
        {text}
      </span>
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5835 7L4.5835 4L1.5835 1" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};