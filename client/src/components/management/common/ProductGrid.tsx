import { AgGridReact } from "ag-grid-react";
import { useProductContext } from "@/contexts/ProductContext";

export const ProductGrid = () => {
  const {
    productData,
    gridRef,
    columnDefs,
    defaultColDef,
    gridOptions,
    onGridReady,
  } = useProductContext();

  return (
    <div className="ag-theme-alpine w-full h-[calc(100vh-60px)]">
      <AgGridReact
        ref={gridRef}
        rowData={productData || []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        {...gridOptions}
      />
    </div>
  );
};
