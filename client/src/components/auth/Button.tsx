import classNames from 'classnames';
import { ReactNode } from 'react';

type ButtonColor =
  | 'black'
  | 'white'
  | 'gray'
  | 'gray2'
  | 'gray3'
  | 'grayWhite'
  | 'disabled'
  | 'cheeseYellow';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  color?: ButtonColor;
  loading?: boolean;
}

export const Button = ({
  children,
  size = 'medium',
  color = 'white',
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) => {
  const baseClasses = 'focus:outline-none rounded-lg transition-colors box-border';

  const colorClasses = classNames({
    'bg-black text-white border border-black': color === 'black',
    'bg-white text-black border border-black': color === 'white',
    'bg-gray text-white border border-gray': color === 'gray',
    'bg-gray2 text-white border border-gray2': color === 'gray2',
    'bg-gray3 text-white border border-gray3': color === 'gray3',
    'bg-buttonGrayWhite text-gray1': color === 'grayWhite',
    'bg-disabledGrayWhite text-gray1': color === 'disabled',
    'bg-cheeseYellow text-black': color === 'cheeseYellow',
  });

  const hoverColorClasses = classNames({
    'hover:bg-black/10 active:bg-black/20':
      color === 'white' || color === 'gray' || color === 'gray2' || color === 'gray3' || color === 'grayWhite',
    'hover:bg-opacity-80 active:bg-opacity-50 active:border-none':
      color === 'cheeseYellow' || color === 'black',
  });

  const sizeClasses = classNames({
    'px-2 py-0.5 text-xs': size === 'xsmall',
    'px-2 py-1 text-sm': size === 'small',
    'px-4 py-2': size === 'medium',
    'px-6 py-3 text-lg': size === 'large',
  });

  const combinedClasses = classNames(
    baseClasses,
    colorClasses,
    sizeClasses,
    hoverColorClasses,
    {
      'opacity-50 cursor-not-allowed': disabled,
    }
  );

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      <div className="flex items-center justify-center w-full gap-2">
        <span>{children}</span>
        {loading && <span>Loading...</span>}
      </div>
    </button>
  );
};
