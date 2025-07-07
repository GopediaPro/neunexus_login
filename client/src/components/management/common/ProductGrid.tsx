import { useProductManagement } from "@/hooks";
import { AgGridReact } from "ag-grid-react";

export const ProductGrid = () => {
  const {
    productData,
    gridRef,
    columnDefs,
    defaultColDef,
    gridOptions,
  } = useProductManagement();

  return (
    <div className="ag-theme-alpine w-full h-[calc(100vh-60px)]">
      <AgGridReact
        ref={gridRef}
        rowData={productData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        {...gridOptions}
      />
    </div>
  );
};
