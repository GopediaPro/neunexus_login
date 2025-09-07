import { toast } from "sonner";

export const createSelectionHandlers = (
  selectedItems: string[],
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
  allItems: any[]
) => {
  const handleItemCheck = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allItemIds = allItems.map(item => item.id);
      setSelectedItems(allItemIds);
      toast.info(`전체 ${allItems.length}개 파일이 선택되었습니다.`);
    } else {
      setSelectedItems([]);
      toast.info('전체 선택이 해제되었습니다.');
    }
  };

  const isAllSelected = allItems.length > 0 && selectedItems.length === allItems.length;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < allItems.length;

  return {
    handleItemCheck,
    handleSelectAll,
    isAllSelected,
    isPartiallySelected
  };
};