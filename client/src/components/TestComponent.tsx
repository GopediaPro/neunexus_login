import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface ProductData {
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

interface OrderData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  deliveryStatus: '주문접수' | '배송준비' | '배송중' | '배송완료' | '취소';
  paymentMethod: '카드' | '현금' | '계좌이체';
  memo: string;
}

const TestComponent = () => { 
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [searchText, setSearchText] = useState('');

  const [modifiedProducts, setModifiedProducts] = useState<ProductData[]>([]);
  const [modifiedOrders, setModifiedOrders] = useState<OrderData[]>([]);

  const gridRef = useRef<AgGridReact>(null);

  const productData = useMemo<ProductData[]>(() => {
    const categories = ['전자제품', '의류', '생활용품', '식품', '도서', '스포츠'];
    const suppliers = ['공급업체A', '공급업체B', '공급업체C', '공급업체D'];
    const statuses: ('판매중' | '품절' | '단종')[] = ['판매중', '품절', '단종'];
    
    return Array.from({ length: 10000 }, (_, index) => {
      const stock = Math.floor(Math.random() * 500);
      const minStock = Math.floor(Math.random() * 50) + 10;
      
      return {
        productId: `P${String(index + 1).padStart(6, '0')}`,
        productName: `상품명${index + 1}`,
        category: categories[index % categories.length],
        price: Math.floor(Math.random() * 100000) + 1000,
        stock: stock,
        minStock: minStock,
        registeredDate: new Date(2023 + Math.floor(Math.random() * 2), 
          Math.floor(Math.random() * 12), 
          Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        status: stock === 0 ? '품절' : statuses[Math.floor(Math.random() * statuses.length)],
        supplier: suppliers[index % suppliers.length],
        description: `상품${index + 1}에 대한 상세 설명입니다.`
      };
    });
  }, []);

  const orderData = useMemo<OrderData[]>(() => {
    const deliveryStatuses: ('주문접수' | '배송준비' | '배송중' | '배송완료' | '취소')[] = 
      ['주문접수', '배송준비', '배송중', '배송완료', '취소'];
    const paymentMethods: ('카드' | '현금' | '계좌이체')[] = ['카드', '현금', '계좌이체'];
    
    return Array.from({ length: 5000 }, (_, index) => {
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = Math.floor(Math.random() * 50000) + 5000;
      
      return {
        orderId: `O${String(index + 1).padStart(6, '0')}`,
        customerName: `고객${index + 1}`,
        customerPhone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        productName: `상품명${Math.floor(Math.random() * 1000) + 1}`,
        quantity: quantity,
        unitPrice: unitPrice,
        totalAmount: quantity * unitPrice,
        orderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        deliveryStatus: deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        memo: index % 3 === 0 ? `특이사항 ${index + 1}` : ''
      };
    });
  }, []);

  const productColumnDefs = useMemo<ColDef<ProductData>[]>(() => [
    { 
      field: 'productId', 
      headerName: '상품ID', 
      width: 120,
      pinned: 'left', // 왼쪽 고정
      checkboxSelection: true, // 체크박스 선택
      headerCheckboxSelection: true, // 헤더 체크박스
    },
    { 
      field: 'productName', 
      headerName: '상품명', 
      width: 200,
      editable: true, // 편집 가능
      filter: 'agTextColumnFilter', // 텍스트 필터
    },
    { 
      field: 'category', 
      headerName: '카테고리', 
      width: 120,
      editable: true,
      filter: 'agTextColumnFilter', // 세트 필터 (다중 선택)
      cellEditor: 'agSelectCellEditor', // 드롭다운 편집기
      cellEditorParams: {
        values: ['전자제품', '의류', '생활용품', '식품', '도서', '스포츠']
      }
    },
    { 
      field: 'price', 
      headerName: '가격',
      width: 120,
      editable: true,
      filter: 'agNumberColumnFilter', 
      valueFormatter: (params: any) => `${params.value?.toLocaleString()}원`,
      // 숫자 입력 검증
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: { min: 0, max: 10000000 }
    },
    { 
      field: 'stock', 
      headerName: '재고',
      width: 100,
      editable: true,
      filter: 'agNumberColumnFilter',
      // 재고 부족 셀 스타일링
      cellStyle: (params: any) => {
        if (params.value <= params.data.minStock) {
          return { backgroundColor: '#ffebee', color: '#c62828' };
        }
        return null;
      }
    },
    { 
      field: 'minStock', 
      headerName: '최소재고',
      width: 100,
      editable: true,
      filter: 'agNumberColumnFilter'
    },
    { 
      field: 'status', 
      headerName: '상태',
      width: 100,
      editable: true,
      filter: 'agTextColumnFilter',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['판매중', '품절', '단종']
      },
      // 상태별 셀 스타일링
      cellStyle: (params: any) => {
        switch (params.value) {
          case '판매중': return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
          case '품절': return { backgroundColor: '#fff3e0', color: '#f57c00' };
          case '단종': return { backgroundColor: '#ffebee', color: '#c62828' };
          default: return null;
        }
      }
    },
    { 
      field: 'supplier', 
      headerName: '공급업체',
      width: 120,
      editable: true,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'registeredDate', 
      headerName: '등록일', 
      width: 130,
      filter: 'agDateColumnFilter',
      valueFormatter: (params: any) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString('ko-KR');
        }
        return '';
      }
    }
  ], []);

  const orderColumnDefs = useMemo<ColDef<OrderData>[]>(() => [
    { 
      field: 'orderId', 
      headerName: '주문ID', 
      width: 120,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { 
      field: 'customerName', 
      headerName: '고객명', 
      width: 120,
      editable: true,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'customerPhone', 
      headerName: '연락처', 
      width: 150,
      editable: true,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'productName', 
      headerName: '상품명', 
      width: 200,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'quantity', 
      headerName: '수량',
      width: 80,
      editable: true,
      filter: 'agNumberColumnFilter',
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: { min: 1, max: 999 }
    },
    { 
      field: 'unitPrice', 
      headerName: '단가',
      width: 120,
      valueFormatter: (params: any) => `${params.value?.toLocaleString()}원`
    },
    { 
      field: 'totalAmount', 
      headerName: '총액',
      width: 120,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => `${params.value?.toLocaleString()}원`,
      cellStyle: (params: any) => {
        if (params.value >= 100000) {
          return { backgroundColor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold' };
        }
        return null;
      }
    },
    { 
      field: 'deliveryStatus', 
      headerName: '배송상태',
      width: 120,
      editable: true,
      filter: 'agTextColumnFilter',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['주문접수', '배송준비', '배송중', '배송완료', '취소']
      },
      // 배송상태별 색상
      cellStyle: (params: any) => {
        switch (params.value) {
          case '주문접수': return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
          case '배송준비': return { backgroundColor: '#fff3e0', color: '#f57c00' };
          case '배송중': return { backgroundColor: '#e3f2fd', color: '#1565c0' };
          case '배송완료': return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
          case '취소': return { backgroundColor: '#ffebee', color: '#c62828' };
          default: return null;
        }
      }
    },
    { 
      field: 'paymentMethod', 
      headerName: '결제방법',
      width: 100,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'orderDate', 
      headerName: '주문일', 
      width: 130,
      filter: 'agDateColumnFilter',
      valueFormatter: (params: any) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString('ko-KR');
        }
        return '';
      }
    },
    { 
      field: 'memo', 
      headerName: '메모', 
      width: 200,
      editable: true,
      filter: 'agTextColumnFilter'
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: false,
    floatingFilter: true,
  }), []);

  const onProductCellValueChanged = useCallback((event: any) => {
    console.log('상품 데이터 변경:', event.data);
    
    // 수량 변경 시 자동으로 상태 업데이트
    if (event.column.getColId() === 'stock') {
      if (event.newValue === 0) {
        event.data.status = '품절';
        event.api.redrawRows({ rowNodes: [event.node] });
      }
    }
    
    setModifiedProducts(prev => {
      const existingIndex = prev.findIndex(item => item.productId === event.data.productId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = event.data;
        return updated;
      } else {
        return [...prev, event.data];
      }
    });
  }, []);

  const onOrderCellValueChanged = useCallback((event: any) => {
    console.log('주문 데이터 변경:', event.data);
    
    // 수량 변경 시 총액 자동 계산
    if (event.column.getColId() === 'quantity') {
      event.data.totalAmount = event.newValue * event.data.unitPrice;
      event.api.redrawRows({ rowNodes: [event.node] });
    }
    
    setModifiedOrders(prev => {
      const existingIndex = prev.findIndex(item => item.orderId === event.data.orderId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = event.data;
        return updated;
      } else {
        return [...prev, event.data];
      }
    });
  }, []);

  // 검색 기능
  const onQuickFilterChanged = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel({
        quickFilter: {
          filter: searchText,
          filterType: 'text'
        }
      });
    }
  }, [searchText]);

  useEffect(() => {
    onQuickFilterChanged();
  }, [searchText, onQuickFilterChanged]);

  // 행 삭제
  const deleteSelectedRows = useCallback(() => {
    if (gridRef.current?.api) {
      const selectedRows = gridRef.current.api.getSelectedRows();
      if (selectedRows.length === 0) {
        alert('삭제할 행을 선택해주세요.');
        return;
      }
      
      if (confirm(`선택된 ${selectedRows.length}개 항목을 삭제하시겠습니까?`)) {
        // 실제로는 여기서 DB 삭제 API 호출
        console.log('삭제할 데이터:', selectedRows);
        alert(`${selectedRows.length}개 항목이 삭제되었습니다.`);
        
        // 그리드에서 행 제거
        gridRef.current.api.applyTransaction({ remove: selectedRows });
      }
    }
  }, []);

  const sendToServer = useCallback(async () => {
    const modifiedData = activeTab === 'products' ? modifiedProducts : modifiedOrders;

    if (modifiedData.length === 0) return;

    try {
      // 추후 호출 코드 fetch 사용 or Axios 사용
      if (activeTab === 'products') {
        setModifiedProducts([]);
      } else {
        setModifiedOrders([]);
      }

    } catch (error) {
      console.error('전송 실패', error);
    }
  }, [activeTab, modifiedProducts, modifiedOrders]);

  const currentData = activeTab === 'products' ? productData : orderData;
  const currentColumnDefs = activeTab === 'products' ? productColumnDefs : orderColumnDefs;
  const modifiedCount = activeTab === 'products' ? modifiedProducts.length : modifiedOrders.length;

  return (
    <div className="w-full h-screen p-4 bg-gray-50">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">상품/주문 관리 시스템</h1>
        
        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'products' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            상품 관리 ({productData.length.toLocaleString()}개)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'orders' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            주문 관리 ({orderData.length.toLocaleString()}개)
          </button>
        </div>

        {/* 도구 모음 */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
          {/* 빠른 검색 */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="전체 검색... (상품명, ID, 고객명 등)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {modifiedCount > 0 && (
            <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
              수정된 항목: {modifiedCount}개
            </div>
          )}
          
          <button
            onClick={deleteSelectedRows}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            선택 삭제
          </button>
          
          <button
            onClick={sendToServer}
            disabled={modifiedCount === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              modifiedCount > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            DB 저장
          </button>
        </div>
      </div>

      {/* AG-Grid */}
      <div className="ag-theme-alpine h-5/6 w-full bg-white rounded-lg shadow-sm">
        <AgGridReact
          theme="legacy"
          ref={gridRef}
          rowData={currentData}
          columnDefs={currentColumnDefs}
          defaultColDef={defaultColDef}
          
          // 성능 최적화 설정
          rowBuffer={0} // 가상화 버퍼 최소화
          maxBlocksInCache={2} // 캐시 블록 수 제한
          blockLoadDebounceMillis={100} // 로딩 디바운스
          
                     // 선택 및 편집 설정
           rowSelection="multiple" // 다중 행 선택
           stopEditingWhenCellsLoseFocus={true} // 포커스 잃으면 편집 종료
          
          // 이벤트 핸들러
          onCellValueChanged={activeTab === 'products' ? onProductCellValueChanged : onOrderCellValueChanged}
          
          // UI 설정
          animateRows={true} // 행 애니메이션
          headerHeight={45} // 헤더 높이
          rowHeight={40} // 행 높이
          
          // 페이지네이션 비활성화 (가상 스크롤 사용)
          pagination={false}
          
          // 그룹화 및 집계 설정 (필요시)
          // groupDefaultExpanded={1}
          // enableRangeSelection={true} // 범위 선택
          
          // 컨텍스트 메뉴 (우클릭 메뉴)
          // allowContextMenuWithControlKey={true}
          
          // 복사/붙여넣기 활성화
          enableCellTextSelection={true}
          suppressClipboardPaste={false}
        />
      </div>

    </div>
  );
}

export default TestComponent;