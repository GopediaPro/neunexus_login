interface ViewAllButtonProps {
  text?: string;
  onClick?: () => void;
}

export const ViewAllButton = ({ 
  text = "전체보기", 
  onClick, 
}: ViewAllButtonProps) => {
  let textWidth = '';
  if (text.split('').length === 2) textWidth = 'w-14 h-6';
  else if (text.split('').length === 3) textWidth = 'w-16 h-6';
  else if (text.split('').length === 4) textWidth = 'w-20 h-6';

  return (
    <button
      onClick={onClick}
      className={`${textWidth} flex items-center gap-2 text-body-s text-text-base-400 hover:text-text-base-500 transition-colors border rounded-[10px] border-stroke-base-100 pl-3`}
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