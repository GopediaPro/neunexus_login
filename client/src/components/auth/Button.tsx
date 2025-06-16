import { cva, type VariantProps } from 'class-variance-authority';
import cx from 'classnames';
import { ReactNode } from 'react';

const buttonStyles = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        primary:
          'bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black',
        secondary:
          'bg-gray2 text-black hover:bg-gray dark:bg-gray3 dark:text-white',
        ghost:
          'border border-black text-black hover:bg-black/10 dark:border-white dark:text-white dark:hover:bg-white/10',
        text:
          'bg-transparent text-black hover:underline dark:text-white dark:hover:underline',
      },
      size: {
        xs: 'px-2 py-0.5 text-xs',
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      },
      loading: {
        true: 'cursor-wait',
      },
    },
    compoundVariants: [
      {
        variant: ['primary', 'secondary', 'ghost', 'text'],
        loading: true,
        class: 'opacity-70',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  children: ReactNode;
  loading?: boolean;
}

export const Button = ({
  children,
  variant,
  size,
  loading = false,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={cx(
        buttonStyles({ variant, size, loading }),
        'disabled:opacity-40 disabled:pointer-events-none',
        className
      )}
      aria-busy={loading}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};
