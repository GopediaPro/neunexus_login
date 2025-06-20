import type { ISidebarMenuItem } from "@/types/sidebar.types";

export const sidebarDummy: ISidebarMenuItem[] = [
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
    submenu: ['고객 지원', '공지사항', 'FAQ']
  },
  {
    id: 'temp1',
    label: '업시메뉴',
    hasSubmenu: false
  },
  {
    id: 'temp2',
    label: '업시메뉴',
    hasSubmenu: false
  },
  {
    id: 'temp3',
    label: '업시메뉴',
    hasSubmenu: false
  }
]