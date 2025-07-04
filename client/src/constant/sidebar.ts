import type { IMenuItemType } from "@/shared/types/sidebar.types";

export const sidebarMenu: IMenuItemType[] = [
  {
    id: 'products',
    label: '상품관리',
    hasSubmenu: true,
    isExpanded: false,
    submenu: ['상품 등록', '상품 목록', '카테고리 관리']
  },
  {
    id: 'orders',
    label: '주문관리',
    hasSubmenu: true,
    isExpanded: false,
    submenu: ['주문 목록', '주문 처리', '배송 관리']
  },
  {
    id: 'service',
    label: '서비스',
    hasSubmenu: true,
    isExpanded: false,
    submenu: ['Wiki', 'Mattermost', 'Minio', 'n8n']
  }
];