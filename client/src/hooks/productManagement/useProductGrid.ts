import { useCallback, useMemo, useRef } from "react";
import { type ColDef } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import type { ProductItem } from "@/api/types";

export const useProductGrid = () => {
  const gridRef = useRef<AgGridReact<ProductItem>>(null);

  // 가격 포맷팅 함수
  const formatCurrency = useCallback((value: number | null | undefined): string => {
    return value ? `${value.toLocaleString()}원` : '';
  }, []);

  // 가격 파싱 함수
  const parseCurrency = useCallback((value: string): number => {
    if (value === null || value === undefined || value === '') return 0;
    const cleanValue = String(value).replace(/[원,]/g, '').trim();
    const numValue = parseFloat(cleanValue);
    return isNaN(numValue) ? 0 : numValue;
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = useCallback((value: string | null | undefined): string => {
    return value ? new Date(value).toLocaleDateString('ko-KR') : '';
  }, []);

  // 텍스트 컬럼 생성
  const createTextColumn = useCallback((field: keyof ProductItem, headerName: string, width: number, editable = true) => ({
    field,
    headerName,
    width,
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    editable,
    cellEditor: 'agTextCellEditor',
  }), []);

  // 가격 컬럼 생성
  const createPriceColumn = useCallback((field: keyof ProductItem, headerName: string) => ({
    ...createTextColumn(field, headerName, 120),
    valueFormatter: (params: any) => formatCurrency(params.value),
    valueParser: (params: any) => parseCurrency(params.newValue),
    filter: 'agNumberColumnFilter',
  }), []);

  const columnDefs: ColDef<ProductItem>[] = useMemo(() => [
    createTextColumn('product_nm', '상품명', 200),
    createTextColumn('goods_nm', '제품명', 200),
    createTextColumn('detail_path_img', '상세이미지', 200),
    createPriceColumn('goods_price', '판매가격'),
    createPriceColumn('delv_cost', '배송비'),
    createTextColumn('goods_search', '검색어', 150),
    createTextColumn('stock_use_yn', '재고여부', 120),
    createTextColumn('certno', '인증번호', 120),
    createTextColumn('char_process', '가공 방식', 120),
    createTextColumn('char_1_nm', '옵션1', 100),
    createTextColumn('char_1_val', '옵션1 값', 100),
    createTextColumn('char_2_nm', '옵션2', 100),
    createTextColumn('char_2_val', '옵션2 값', 100),
    createTextColumn('img_path', '메인 이미지', 120),
    createTextColumn('img_path1', '추가 이미지1', 120),
    createTextColumn('img_path2', '추가 이미지2', 120),
    createTextColumn('img_path3', '추가 이미지3', 120),
    createTextColumn('img_path4', '추가 이미지4', 120),
    createTextColumn('img_path5', '추가 이미지5', 120),
    createTextColumn('goods_remarks', '상품비고', 150),
    createTextColumn('mobile_bn', '모바일배너', 120),
    createTextColumn('one_plus_one_bn', '1+1배너', 120),
    createTextColumn('goods_remarks_url', '비고URL', 150),
    createTextColumn('delv_one_plus_one', '1+1배송정보', 150),
    createTextColumn('delv_one_plus_one_detail', '1+1배송상세', 150),
    createTextColumn('class_nm1', '대분류', 120),
    createTextColumn('class_nm2', '중분류', 120),
    createTextColumn('class_nm3', '소분류', 120),
    createTextColumn('class_nm4', '세분류', 120),
    {
      field: 'created_at',
      headerName: '생성일시',
      width: 140,
      valueFormatter: (params: any) => formatDate(params.value),
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true },
      editable: false,
    },
    {
      field: 'updated_at',
      headerName: '수정일시',
      width: 140,
      valueFormatter: (params: any) => formatDate(params.value),
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: { suppressFilterButton: true },
      editable: false,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: false,
    minWidth: 80,
    suppressHeaderMenuButton: false
  }), []);

  const gridOptions = useMemo(() => ({
    theme: "legacy" as const,
    pagination: false,
    paginationPageSize: 20,
    animateRows: true,
    headerHeight: 45,
    rowHeight: 40,
    rowSelection: {
      mode: "multiRow" as const,
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: true,
      selectAll: "filtered" as const
    },
    domLayout: "normal" as const,
    enterNavigatesVertically: true,
    enterNavigatesVerticallyAfterEdit: true,
    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
  }), []);

  return {
    gridRef,
    columnDefs,
    defaultColDef,
    gridOptions,
  };
}