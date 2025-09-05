interface SelectAllCheckboxProps {
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  onSelectAll: (checked: boolean) => void;
  selectedCount: number;
  totalCount: number;
  disabled?: boolean;
}

export const SelectAllCheckbox = ({
  isAllSelected,
  isPartiallySelected,
  onSelectAll,
  selectedCount,
  totalCount,
  disabled = false
}: SelectAllCheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isAllSelected}
        ref={(input) => {
          if (input) {
            input.indeterminate = isPartiallySelected;
          }
        }}
        onChange={(e) => onSelectAll(e.target.checked)}
        className="w-4 h-4 rounded border-stroke-base-300 cursor-pointer"
        disabled={disabled}
      />
      <span className="text-body-s text-text-base-500">
        전체 선택 ({selectedCount}/{totalCount})
      </span>
    </div>
  );
};