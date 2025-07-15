import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts";
import { ROUTERS } from "@/constant/route";
import { sidebarMenu } from "@/constant/sidebar";
import type { IMenuItemType } from "@/shared/types/sidebar.types";

const withHoverState = (items: IMenuItemType[]): IMenuItemType[] =>
  items.map(item => ({ ...item, isHovered: false }));

export const useMenuSideabar = () => {
  const [MenuItems, setMenuItems] = useState<IMenuItemType[]>(withHoverState(sidebarMenu));
  const hoverTimers = useRef<{ [id: string]: NodeJS.Timeout | null }>({});
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const name = user?.name?.split(' ')[0] ?? '김00 사원';
  const userProfile = {
    name: `${name} 님`,
    department: '온라인 사업 부서'
  };

  const toggleSubmenu = (itemId: string) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  };

  const setHoverState = (itemId: string, isHovered: boolean) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, isHovered }
          : item
      )
    );
  };

  const handleMenuHover = (itemId: string) => {
    if (hoverTimers.current[itemId]) {
      clearTimeout(hoverTimers.current[itemId]!);
      hoverTimers.current[itemId] = null;
    }

    const item = MenuItems.find(item => item.id === itemId);
    if (item?.hasSubmenu) {
      setHoverState(itemId, true);
      
      if (!item.isExpanded) {
        hoverTimers.current[itemId] = setTimeout(() => {
          toggleSubmenu(itemId);
        }, 200);
      }
    }
  };

  const handleMenuLeave = (itemId: string) => {
    if (hoverTimers.current[itemId]) {
      clearTimeout(hoverTimers.current[itemId]!);
      hoverTimers.current[itemId] = null;
    }

    const item = MenuItems.find(item => item.id === itemId);
    if (item?.hasSubmenu) {
      setHoverState(itemId, false);
      
      if (item.isExpanded) {
        hoverTimers.current[itemId] = setTimeout(() => {
          toggleSubmenu(itemId);
        }, 300);
      }
    }
  };

  const handleSubMenuClick = (subItem: string) => {
    switch (subItem) {
      case 'Wiki':
        window.location.href = 'https://wiki.lyckabc.xyz';
        break;
      case 'Mattermost':
        window.location.href = 'https://chat.lyckabc.xyz';
        break;
      case 'Minio':
        window.location.href = 'https://minio.lyckabc.xyz';
        break;
      case 'n8n':
        window.location.href = 'https://rpa.lyckabc.xyz';
        break;
      case '상품 등록':
        navigate(ROUTERS.PRODUCT_MANAGEMENT);
        break;
      case '주문 목록':
        navigate(ROUTERS.ORDER_MANAGEMENT);
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return {
    MenuItems,
    userProfile,
    toggleSubmenu,
    handleSubMenuClick,
    handleMenuHover,
    handleMenuLeave,
    handleLogout,
    handleLogoClick,
  };
};
