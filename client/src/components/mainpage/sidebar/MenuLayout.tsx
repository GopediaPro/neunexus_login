import { MenuBox } from "@/components/mainpage/common/MenuBox";
import { Icon } from "@/components/ui/Icon";
import { menuItems } from "@/constant/menu";

export const MenuGridLayout = () => {

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-8 max-w-2xl">
        {menuItems.map((item) => (
          <MenuBox
            key={item.id}
            icon={<Icon name={item.icon} style="w-6 h-6" />}
            label={item.label}
            onClick={() => console.log(`${item.label} 클릭됨`)}
          />
        ))}
        
        <MenuBox
          icon={<Icon name="plus" style="w-5 h-5" />}
          className="opacity-50 hover:opacity-100"
        />
      </div>
    </div>
  );
};