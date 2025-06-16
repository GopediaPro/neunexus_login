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
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
      {isPasswordType && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="text-border-icon hover:text-font-secondary focus:outline-none transition-colors"
        >
          <img
            src={showPassword ? "/image/eye-off.svg" : "/image/eye.svg"}
            alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className="w-5 h-5"
          />
        </button>
      )}

      {error && (
        <img 
          src="/image/alert.svg" 
          alt="에러 이미지" 
          className="w-5 h-5 text-web-error"
        />
      )}
    </div>
  );
}