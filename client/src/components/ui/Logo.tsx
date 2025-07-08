import { useTheme } from "next-themes";
import LogoLight from "@/shared/assets/icons/logo.svg"
import LogoDark from "@/shared/assets/icons/logo-dark.svg";

export const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  return (
    <div>
      {theme === 'dark' ? (
        <img src={LogoLight} alt="로고" className={className} />
      ) : (
        <img src={LogoDark} alt="다크로고" className={className} />
      )}
    </div>
  );
};