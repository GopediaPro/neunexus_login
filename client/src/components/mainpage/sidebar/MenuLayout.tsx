import { MenuBox } from "@/components/mainpage/common/MenuBox";
import { menuItems } from "@/mocks/dummy/menu";

export const MenuGridLayout = () => {

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-8 max-w-2xl">
        {menuItems.map((item) => (
          <MenuBox
            key={item.id}
            icon={<img src={`/image/${item.icon}`} className="w-6 h-6" />}
            label={item.label}
            onClick={() => console.log(`${item.label} 클릭됨`)}
          />
        ))}
        
        <MenuBox
          icon={
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
          label=""
          className="opacity-50 hover:opacity-100"
        />
      </div>
    </div>
  );
};