import type { ColDef } from "ag-grid-community";

const baseColumn = {
  resizable: true,
  sortable: true,
  filter: true,
  floatingFilter: true,
  minWidth: 120,
  floatingFilterComponentParams: {
    suppressFilterButton: true
  },
  editable: true,
};

const priceFormatter = (params: any): string => {
  const value = params.value;
  if (value === null || value === undefined || value === '') return '';
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(numValue) ? '' : `${numValue.toLocaleString()}원`;
};

const priceParser = (params: any): number | null => {
  const value = params.newValue;
  if (value === null || value === undefined || value === '') return null;
  
  const cleanValue = String(value).replace(/[원,]/g, '').trim();
  const numValue = parseFloat(cleanValue);
  
  return isNaN(numValue) ? null : numValue;
};

const priceSetter = (params: any): boolean => {
  const { field, newValue } = params;
  let parsedValue = null;
  
  if (newValue !== null && newValue !== undefined && newValue !== '') {
    const cleanValue = String(newValue).replace(/[원,]/g, '').trim();
    const numValue = parseFloat(cleanValue);
    parsedValue = isNaN(numValue) ? null : numValue;
  }
  
  params.data[field] = parsedValue;
  return true;
};

const dateFormatter = (params: any): string => {
  return params.value ? new Date(params.value).toLocaleDateString('ko-KR') : '';
};

export const createTextColumn = (field: string, headerName: string, width: number, options: {
  tooltip?: boolean;
  maxLength?: number;
} = {}): ColDef => ({
  ...baseColumn,
  field,
  headerName,
  width,
  filter: 'agTextColumnFilter',
  ...(options.tooltip && { tooltipField: field }),
  cellEditor: 'agTextCellEditor',
  ...(options.maxLength && {
    cellEditorParams: { maxLength: options.maxLength }
  })
});

export const createNumberColumn = (field: string, headerName: string, width: number, options: {
  min?: number;
  max?: number;
  centered?: boolean;
} = {}): ColDef => ({
  ...baseColumn,
  field,
  headerName,
  width,
  filter: 'agNumberColumnFilter',
  ...(options.centered && { cellClass: 'ag-cell-centered' }),
  cellEditor: 'agNumberCellEditor',
  cellEditorParams: {
    ...(options.min !== undefined && { min: options.min }),
    ...(options.max !== undefined && { max: options.max })
  }
});

export const createPriceColumn = (field: string, headerName: string, width: number): ColDef => ({
  ...baseColumn,
  field,
  headerName,
  width,
  valueFormatter: priceFormatter,
  valueParser: priceParser,
  valueSetter: priceSetter,
  filter: 'agNumberColumnFilter',
  cellEditor: 'agTextCellEditor',
  cellEditorParams: { maxLength: 20 }
});

export const createDateColumn = (field: string, headerName: string, width: number = 150): ColDef => ({
  ...baseColumn,
  field,
  headerName,
  width,
  valueFormatter: dateFormatter,
  filter: 'agDateColumnFilter',
  cellEditor: 'agDateCellEditor'
});