import type { ReactNode } from "react"

interface MenuBoxProps {
  icon: ReactNode;
  label?: string;
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
          relative flex justify-center items-center w-[4.65rem] h-[4.65rem]
          bg-fill-base-100 border border-stroke-base-100  rounded-xl
          ${className}
        `}
      >
        <div className="w-9 h-9 flex items-center justify-center mb-1 text-text-base-400">
          {icon}
        </div>
        <span className="absolute bottom-[-22px] text-h6 text-center leading-tight text-text-base-500">
          {label}
        </span>
      </button>
    </>
  )
}