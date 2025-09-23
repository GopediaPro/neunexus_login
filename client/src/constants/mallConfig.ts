export interface MallConfig {
  code: string;
  name: string;
  discountRate: number;
}

export interface MallConfigs {
  [key: string]: MallConfig;
}

export const DEFAULT_MALL_CONFIG: MallConfigs = {
  'shop0001': { code: 'shop0001', name: '11번가', discountRate: 5 },
  'shop0002': { code: 'shop0002', name: 'G마켓', discountRate: 8 },
  'shop0003': { code: 'shop0003', name: '옥션', discountRate: 7 },
  'shop0004': { code: 'shop0004', name: '인터파크', discountRate: 6 },
  'shop0005': { code: 'shop0005', name: '위메프', discountRate: 10 },
  'shop0006': { code: 'shop0006', name: '티몬', discountRate: 9 },
  'shop0007': { code: 'shop0007', name: 'GS shop', discountRate: 5 },
  'shop0008': { code: 'shop0008', name: 'CJ온스타일', discountRate: 7 },
  'shop0009': { code: 'shop0009', name: '롯데i몰', discountRate: 6 },
  'shop0010': { code: 'shop0010', name: '현대Hmall', discountRate: 8 },
  'shop0011': { code: 'shop0011', name: '쿠팡', discountRate: 15 },
  'shop0012': { code: 'shop0012', name: '아마존', discountRate: 12 },
  'shop0013': { code: 'shop0013', name: '이베이', discountRate: 10 },
  'shop0014': { code: 'shop0014', name: '알리익스프레스', discountRate: 20 },
  'shop0015': { code: 'shop0015', name: '타오바오', discountRate: 18 },
  'shop0016': { code: 'shop0016', name: '바이두', discountRate: 16 },
  'shop0017': { code: 'shop0017', name: '라쿠텐', discountRate: 14 },
  'shop0018': { code: 'shop0018', name: '야후쇼핑', discountRate: 13 },
  'shop0019': { code: 'shop0019', name: 'SSG닷컴', discountRate: 7 },
  'shop0020': { code: 'shop0020', name: '홈플러스', discountRate: 5 },
  'shop0021': { code: 'shop0021', name: '이마트몰', discountRate: 6 },
  'shop0022': { code: 'shop0022', name: '롯데마트몰', discountRate: 5 },
  'shop0023': { code: 'shop0023', name: '하이마트', discountRate: 8 },
  'shop0024': { code: 'shop0024', name: '전자랜드', discountRate: 7 },
  'shop0025': { code: 'shop0025', name: '교보문고', discountRate: 3 },
  'shop0026': { code: 'shop0026', name: '알라딘', discountRate: 4 },
  'shop0027': { code: 'shop0027', name: '리디북스', discountRate: 5 },
  'shop0028': { code: 'shop0028', name: '밀리의 서재', discountRate: 6 },
  'shop0029': { code: 'shop0029', name: 'YES24', discountRate: 8 },
  'shop0030': { code: 'shop0030', name: '텐바이텐', discountRate: 10 },
  'shop0031': { code: 'shop0031', name: '네이버 스마트스토어', discountRate: 0 }
};

export const MALL_CONFIG_ARRAY = Object.values(DEFAULT_MALL_CONFIG);