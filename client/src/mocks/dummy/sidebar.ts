import type { IMenuItemType } from "@/share/types/sidebar.types";

export const sidebarDummy: IMenuItemType[] = [
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
];

export const member = [
  { id: "1", name: "김OO 주임", department: "마케팅 부서" },
  { id: "2", name: "김OO 주임", department: "마케팅 부서" },
  { id: "3", name: "김OO 주임", department: "마케팅 부서" },
  { id: "4", name: "김OO 주임", department: "마케팅 부서" }
]

export const notices = [
  { id: "1", title: "신규 업무 시스템 도입 안내", date: "2025.06.09" },
  { id: "2", title: "신규 업무 시스템 도입 안내", date: "2025.06.09" },
  { id: "3", title: "신규 업무 시스템 도입 안내", date: "2025.06.09" },
  { id: "4", title: "신규 업무 시스템 도입 안내 오버플로우 테스트 진행 고고", date: "2025.06.09" }
];

export const schedules = [
  { id: "1", title: "신규 업무 시스템 도입 안내", time: "13:00" },
  { id: "2", title: "신규 업무 시스템 도입 안내", time: "13:00" },
  { id: "3", title: "신규 업무 시스템 도입 안내", time: "13:00" }
];
