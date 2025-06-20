export interface ISidebarMenuItem {
  id: string;
  label: string;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  submenu?: string[];
}