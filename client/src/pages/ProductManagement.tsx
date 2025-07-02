import { getProduct } from "@/api/product.api";
import type { ProductData } from "@/shared/types/product.types";
import { AgGridReact } from "ag-grid-react";
import { type ColDef } from 'ag-grid-community';
import { useEffect, useRef, useState } from "react";

export const ProductManagement = () => {
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gridRef = useRef<AgGridReact>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProduct();
      setProductData(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터 로딩 실패';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columnDefs: ColDef<ProductData>[] = [
    { field: 'productId', headerName: '상품ID', width: 120 },
    { field: 'productName', headerName: '상품명', width: 200 },
    { field: 'category', headerName: '카테고리', width: 120 },
    { 
      field: 'price', 
      headerName: '가격', 
      width: 120,
      valueFormatter: (params) => `${params.value?.toLocaleString()}원`
    },
    { field: 'stock', headerName: '재고', width: 100 },
    { field: 'minStock', headerName: '최소재고', width: 100 },
    { field: 'status', headerName: '상태', width: 100 },
    { field: 'supplier', headerName: '공급업체', width: 120 },
    { 
      field: 'registeredDate', 
      headerName: '등록일', 
      width: 130,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString('ko-KR');
        }
        return '';
      }
    },
    { field: 'description', headerName: '설명', width: 200 }
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
  };

  if(loading) {
    <div>로딩</div>
  }

  return (
    <div className="w-full h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <button 
          onClick={fetchProducts}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? '로딩' : '새로고침'}
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        총 <span className="font-semibold text-blue-600">{productData.length}</span>개 상품
      </div>

      <div className="ag-theme-alpine h-4/5 w-full border rounded-lg">
        <AgGridReact
          ref={gridRef}
          rowData={productData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={false}
          animateRows={true}
          headerHeight={45}
          rowHeight={40}
          onRowClicked={(event) => {
            console.log('선택된 상품:', event.data);
          }}
        />
      </div>
    </div>
  );
};