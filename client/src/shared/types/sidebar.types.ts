export interface ILeftMenuButtonProps {
  text: string;
  hasSubmenu?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
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
  submenu?: string[];
}