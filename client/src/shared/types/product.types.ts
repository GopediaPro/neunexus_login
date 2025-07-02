export interface ProductData {
  data: never[];
  productId: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  registeredDate: string;
  status: '판매중' | '품절' | '단종';
  supplier: string;
  description: string;
}