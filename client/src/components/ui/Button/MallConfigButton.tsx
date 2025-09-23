import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface MallConfigButtonProps {
  onClick: () => void;
  isConfigSet: boolean;
  disabled?: boolean;
}

export const MallConfigButton = ({
  onClick,
  isConfigSet,
  disabled = false
}: MallConfigButtonProps) => {
  return (
    <Button
      variant={isConfigSet ? "default" : "light"}
      onClick={onClick}
      disabled={disabled}
      className="w-full"
    >
      <Icon name="settings" style="w-4 h-4 mr-2" />
      쇼핑몰별 판매가 설정
      {isConfigSet && (
        <Icon name="check" style="w-4 h-4 ml-2 text-white" />
      )}
    </Button>
  );
};