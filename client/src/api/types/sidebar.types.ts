export interface ILeftMenuButtonProps {
  text: string;
  hasSubmenu?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface ISubMenuItemProps {
  text: string;
  parentText: string;
  onClick?: () => void;
  className?: string;
}

export interface IMenuItemType {
  id: string;
  label: string;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  isHovered?: boolean;
  submenu?: string[];
}