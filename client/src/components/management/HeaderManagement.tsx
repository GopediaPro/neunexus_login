import { useSidebar } from "@/contexts/SidebarContext";
import { Icon } from "../ui/Icon";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";
import { Button } from "../ui/Button";
import { useState } from "react";

type ProductTab = "registration" | "bulk-registration";

export const HeaderManagement = ({ title }: { title: string }) => {
  const naviagte = useNavigate();
  const { toggle } = useSidebar();
  const [activeProductTab, setActiveProductTab] = useState<ProductTab>("registration");

  return (
    <div className="bg-page-card-bg">
      <div className="flex items-center gap-4 h-[4.5rem] pl-4 bg-page-blue-400 text-white">
        <button onClick={toggle}>
          <Icon name="hamberger" ariaLabel="검색" style="w-7 h-7 text-gray-300" />
        </button>
        <span className="text-h1">
          {title}
        </span>
      </div>
      <div className="px-6">
        <div className="flex gap-2 pt-2 border-b">
          <button className="px-4 py-2 text-page-blue-400 text-h2 border-b-2 border-page-blue-400">상품관리</button>
          <button onClick={() => naviagte(ROUTERS.ORDER_MANAGEMENT)} className="px-4 py-2 text-gray-500 text-h2 hover:text-page-blue-400 hover:bg-gray-100 transition-colors">주문관리</button>
        </div>
        <div className="flex gap-4 pt-6">
          <Button 
            onClick={() => setActiveProductTab("registration")}
            size="lg" 
            className={`border border-border-default transition-colors ${
              activeProductTab === "registration"
                ? "bg-page-blue-400 text-white"
                : "text-page-font-primary dark:text-black bg-gray-200"
            }`}>
            상품등록
          </Button>
          <Button 
            onClick={() => setActiveProductTab("bulk-registration")}
            size="lg" 
            className={`border border-border-default transition-colors ${
              activeProductTab === "bulk-registration"
                ? "bg-page-blue-400 text-white"
                : "text-page-font-primary dark:text-black bg-gray-200"
            }`}>
            대량상품등록
          </Button>
        </div>
        <div className="mt-6">
          <span className="text-h2">상품등록</span>
        </div>
      </div>
    </div>
  );
};
