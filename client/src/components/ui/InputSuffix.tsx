import { Icon } from "@/components/ui/Icon";

interface InputSuffixProps {
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  type?: string;
}

export const InputSuffix = ({
  error,
  showPassword,
  onTogglePassword,
  type
}: InputSuffixProps) => {
  const isPasswordType = type === 'password' || (type === 'text' && onTogglePassword);

  return (
    <div className="absolute inset-y-0 right-1 flex items-center pr-3 space-x-2">
      {isPasswordType && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="text-text-base-500 hover:text-text-base-500 focus:outline-none transition-colors"
        >
          {!showPassword ? (
            <Icon name="eye-off" ariaLabel="감은눈" style="w-5 h-5" />
          ) : (
            <Icon name="eye" ariaLabel="눈" style="w-5 h-5" />
          )}
        </button>
      )}

      {error && (
        <Icon name="alert" ariaLabel="에러이미지" style="w-5 h-5 text-error-500" />
      )}
    </div>
  );
}