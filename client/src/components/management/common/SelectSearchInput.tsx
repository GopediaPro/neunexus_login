import { useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectSearchInputProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SelectSearchInput = ({
  options,
  value,
  onChange,
  placeholder
}: SelectSearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <div 
        className="w-full p-3 border border-stroke-base-100 rounded-lg bg-fill-base-100 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 cursor-pointer"
        onClick={handleInputClick}
      >
        <div className="flex items-center justify-between">
          {isOpen ? (
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="검색..."
              className="w-full outline-none bg-transparent"
              autoFocus
            />
          ) : (
            <span className={selectedOption ? "text-text-base-500" : "text-text-base-400"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          <div className="ml-2 pointer-events-none">
            <svg 
              className={`w-5 h-5 text-text-base-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-fill-base-100 border border-stroke-base-100 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-fill-alt-100 ${
                  value === option.value ? 'bg-primary-50 text-primary-500' : 'text-text-base-500'
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-text-base-400">검색 결과가 없습니다.</div>
          )}
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
}