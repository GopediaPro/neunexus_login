import type { ChangeEvent } from "react";

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  helperText?: string;
  variant?: 'default' | 'code';
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const Textarea = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  variant = 'default',
  className = '', 
  placeholder,
  rows = 4,
  ref,
  ...props 
}: TextareaProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const baseClasses = `
    w-full p-3 border rounded-lg resize-vertical
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
  `;

  const variantClasses = {
    default: 'bg-white',
    code: 'bg-gray-50 font-mono text-sm'
  };

  return (
    <div>
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
      {helperText && (
        <p className={`text-sm mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};