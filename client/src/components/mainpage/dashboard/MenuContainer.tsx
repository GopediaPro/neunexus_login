import { MenuBox } from "@/components/mainpage/common/MenuBox";
import { Icon } from "@/components/ui/Icon";
import { menuItems } from "@/constant/menu";

export const MenuContainer = () => {

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-4 gap-10 gap-x-20 max-w-[340px] 2xl:flex 2xl:flex-wrap 2xl:gap-4 2xl:max-w-full">
        {menuItems.map((item) => (
          <MenuBox
            key={item.id}
            icon={<Icon name={item.icon} style="w-7 h-7" />}
            label={item.label}
            className="flex-shrink-0 2xl:mb-4"
          />
        ))}
        
        <MenuBox
          icon={<Icon name="plus" style="w-8 h-8" />}
          className="opacity-50 hover:opacity-100 flex-shrink-0"
        />
      </div>
    </div>
  );
};