import { MenuBox } from "@/components/mainpage/common/MenuBox";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/ModalComponent";
import { menuItems } from "@/constants";
import { useState } from "react";

export const MenuContainer = () => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectMenuItems, setSelectMenuItems] = useState(menuItems.slice(0, 4));

  const handleAddClick = () => {
    setShowAddMenu(true);
  };

  const handleAddMenuClose = () => {
    setShowAddMenu(false);
  };

  const handleMenuAdd = (menuItem: typeof menuItems[0]) => {
    setSelectMenuItems([...selectMenuItems, menuItem]);
    setShowAddMenu(false);
  };

  const availableMenuItems = menuItems.filter(
    (item) => !selectMenuItems.some((selected) => selected.id === item.id)
  );

  return (  
    <div className="flex-1 p-6">
      <div className="grid grid-cols-4 gap-10 gap-x-10 max-w-[340px] 2xl:flex 2xl:flex-wrap 2xl:gap-4 2xl:max-w-full">
        {selectMenuItems.map((item) => (
          <MenuBox
            key={item.id}
            icon={<Icon name={item.icon} style="w-7 h-7" />}
            label={item.label}
            className="flex-shrink-0 2xl:mb-4"
          />
        ))}
        
        {availableMenuItems.length > 0 && (
          <MenuBox
            icon={<Icon name="plus" style="w-8 h-8" />}
            className="opacity-50 hover:opacity-100 flex-shrink-0"
            onClick={handleAddClick}
          />
        )}
      </div>

      <Modal isOpen={showAddMenu} onClose={handleAddMenuClose} size="md">
        <Modal.Header>
          <Modal.Title>메뉴 추가</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        
        <Modal.Body>
          <div className="space-y-3">
            {availableMenuItems.map((menuItem) => (
              <button
                key={menuItem.id}
                onClick={() => handleMenuAdd(menuItem)}
                className="w-full text-left p-3 rounded-lg hover:bg-fill-alt-100 flex items-center space-x-3"
              >
                <Icon name={menuItem.icon} style="w-5 h-5 text-web-primary" />
                <span className="text-text-base-500">{menuItem.label}</span>
              </button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};