import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Icon } from './Icon';

interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown = ({
  trigger,
  items,
  align = 'left',
  className = ''
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 mt-2 py-1 bg-fill-base-100 border border-stroke-base-200 rounded-lg shadow-lg min-w-[160px] ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                item.disabled 
                  ? 'text-text-base-300 cursor-not-allowed' 
                  : 'text-text-base-400 hover:bg-fill-alt-100 hover:text-text-base-500'
              }`}
            >
              {item.icon && (
                <Icon 
                  name={item.icon} 
                  style={`w-4 h-4 ${item.disabled ? 'text-text-base-300' : 'text-text-base-400'}`}
                />
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};