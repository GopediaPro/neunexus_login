import { MenuBox } from "@/components/mainpage/common/MenuBox";
import { Icon } from "@/components/ui/Icon";
import { menuItems } from "@/constant/menu";

export const MenuGridLayout = () => {

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-6 max-w-[340px] 2xl:flex 2xl:flex-wrap 2xl:gap-4 2xl:max-w-full">
        {menuItems.map((item) => (
          <MenuBox
            key={item.id}
            icon={<Icon name={item.icon} style="w-6 h-6" />}
            label={item.label}
            className="flex-shrink-0 2xl:mb-4"
          />
        ))}
        
        <MenuBox
          icon={<Icon name="plus" style="w-5 h-5" />}
          className="opacity-50 hover:opacity-100 flex-shrink-0"
        />
      </div>
    </div>
  );
};