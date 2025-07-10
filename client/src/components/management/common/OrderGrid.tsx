import { useCallback, useMemo, useRef } from "react";
import type { ColDef, GridReadyEvent } from "ag-grid-community";
import { useOrders } from "@/hooks/orderManagement/useOrders";
import { AgGridReact } from "ag-grid-react";

interface OrderGridProps {
  templateCode: string;
}

export const OrderGrid = ({ templateCode }: OrderGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const { data: ordersData, isLoading} = useOrders({ templateCode });

  const rowData = useMemo(() => {
    if (ordersData?.items && ordersData.items.length > 0) {
      if (ordersData.items[0]?.data) {
        const actualData = ordersData.items[0].data;
        return actualData || [];
      }
    }
    
    return [];
  }, [ordersData]);

  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'order_id',
      headerName: '주문ID',
      width: 120,
      pinned: 'left',
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'mall_order_id',
      headerName: '몰주문ID',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'product_name',
      headerName: '상품명',
      width: 250,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      tooltipField: 'product_name'
    },
    {
      field: 'receive_name',
      headerName: '받는분',
      width: 100,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'receive_cel',
      headerName: '연락처',
      width: 120,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'sale_cnt',
      headerName: '수량',
      width: 80,
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      cellClass: 'ag-cell-centered'
    },
    {
      field: 'pay_cost',
      headerName: '결제금액',
      width: 120,
      valueFormatter: (params) => {
        return params.value ? `${Number(params.value).toLocaleString()}원` : '';
      },
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'expected_payout',
      headerName: '예상정산금',
      width: 120,
      valueFormatter: (params) => {
        return params.value ? `${Number(params.value).toLocaleString()}원` : '';
      },
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'service_fee',
      headerName: '서비스수수료',
      width: 120,
      valueFormatter: (params) => {
        return params.value ? `${Number(params.value).toLocaleString()}원` : '';
      },
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'delv_cost',
      headerName: '배송비',
      width: 100,
      valueFormatter: (params) => {
        return params.value ? `${Number(params.value).toLocaleString()}원` : '';
      },
      filter: 'agNumberColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'fld_dsp',
      headerName: '판매처',
      width: 150,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'receive_addr',
      headerName: '배송주소',
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      tooltipField: 'receive_addr'
    },
    {
      field: 'delv_msg',
      headerName: '배송메모',
      width: 180,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      tooltipField: 'delv_msg'
    },
    {
      field: 'sku_value',
      headerName: 'SKU정보',
      width: 200,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      },
      tooltipField: 'sku_value'
    },
    {
      field: 'process_dt',
      headerName: '처리일시',
      width: 120,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '',
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    },
    {
      field: 'created_at',
      headerName: '생성일시',
      width: 120,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '',
      filter: 'agDateColumnFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true
      }
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    minWidth: 100,
  }), []);

  const gridOptions = useMemo(() => ({
    theme: "legacy" as const,
    pagination: false,
    paginationPageSize: 20,
    animateRows: true,
    headerHeight: 45,
    rowHeight: 40,
    rowSelection: "multiple" as const,
    domLayout: "normal" as const,
    suppressRowClickSelection: true
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setTimeout(() => {
      if (params.api) {
        params.api.sizeColumnsToFit();
      }
    }, 100);
  }, []);


  return (
    <div className="ag-theme-alpine w-full h-[calc(100vh-60px)] bg-fill-base-100">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        {...gridOptions}
        loading={isLoading}
        getRowId={(params) => params.data.id.toString()}
      />
    </div>
  );
};
