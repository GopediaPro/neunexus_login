import type { ReactNode } from "react"

interface MenuBoxProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const MenuBox = ({ 
  icon, 
  label, 
  onClick, 
  className
}: MenuBoxProps) => {

  return (
    <>
      <button
        onClick={onClick}
        className={`
          flex justify-center items-center w-[3.5rem] h-[3.5rem] border rounded-xl
          
          ${className}
        `}
      >
        <div className="w-6 h-6 flex items-center justify-center mb-1 text-page-font-muted">
          {icon}
        </div>
      </button>
      <span className="text-xs text-center leading-tight text-page-font-primary">
        {label}
      </span>
    </>
  )
}