import OrderIcon from "@/share/icons/OrderIcon";
import ProductIcon from "@/share/icons/ProductIcon";
import ServiceIcon from "@/share/icons/ServiceIcon";

const iconMap = {
  product: ProductIcon,
  order: OrderIcon,
  service: ServiceIcon,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
  ariaLabel?: string;
}

export const Icon = ({ name, className, ariaLabel }: IconProps) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} aria-label={ariaLabel} />;
};