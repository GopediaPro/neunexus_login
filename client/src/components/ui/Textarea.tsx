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
    focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    disabled:bg-fill-alt-100 disabled:text-text-base-200 disabled:cursor-not-allowed
    ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : 'border-stroke-base-100'}
  `;

  const variantClasses = {
    default: 'bg-fill-base-100',
    code: 'bg-fill-base-100 font-mono text-sm'
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
        <p className={`text-sm mt-1 ${error ? 'text-error-500' : 'text-text-base-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};