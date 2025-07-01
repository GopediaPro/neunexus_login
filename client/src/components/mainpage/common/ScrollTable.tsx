interface ScrollTableProps {
  children: React.ReactNode;
  height?: string;
  className?: string;
}

export const ScrollTable = ({ 
  children, 
  height,
  className,
}: ScrollTableProps) => {
  return (
    <div className={`${height} overflow-y-auto scrollbar-thin scrollbar-thumb-page-blue-400 scrollbar-track-gray-200 pr-2 ${className}`}>
      {children}
    </div>
  );
};