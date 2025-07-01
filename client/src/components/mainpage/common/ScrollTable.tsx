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
    <div className={`${height} overflow-y-scroll always-show-scrollbar rounded pr-2 ${className}`}>
      {children}
    </div>
  );
};