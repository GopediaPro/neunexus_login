import { useRef } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";
import { useState } from "react";

type ProductTab = "registration" | "bulk-registration";

export const ProductToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeProductTab, setActiveProductTab] = useState<ProductTab>("registration");
  const naviagte = useNavigate();

  const handleIconClick = () => {
    inputRef.current?.focus();
  }

  return (
    <>
      <div className="px-6">
        <div className="flex gap-2 pt-2 border-b bg-gray-50">
          <button className="px-4 py-2 text-page-blue-400 bg-page-card-bg text-h2 border-b-2 border-page-blue-400">상품관리</button>
          <button onClick={() => naviagte(ROUTERS.ORDER_MANAGEMENT)} className="px-4 py-2 text-gray-500 text-h2 hover:text-page-blue-400 hover:bg-gray-100 transition-colors">주문관리</button>
        </div>
        <div className="flex gap-4 pt-6">
          <Button 
            onClick={() => setActiveProductTab("registration")}
            size="lg" 
            className={`border border-border-default transition-colors ${
              activeProductTab === "registration"
                ? "bg-page-blue-400 text-white"
                : "text-page-font-primary dark:text-black hover:text-white bg-gray-200"
            }`}>
            상품등록
          </Button>
          <Button 
            onClick={() => setActiveProductTab("bulk-registration")}
            size="lg" 
            className={`border border-border-default transition-colors ${
              activeProductTab === "bulk-registration"
                ? "bg-page-blue-400 text-white"
                : "text-page-font-primary dark:text-black hover:text-white bg-gray-200"
            }`}>
            대량상품등록
          </Button>
        </div>
        <div className="mt-6">
          <span className="text-h2">상품등록</span>
        </div>
      </div>
      <div className="flex items-center gap-4 px-6 pt-5 bg-page-card-bg">
        <div className="flex items-center w-[320px] h-10 bg-gray-200 rounded-md px-3">
          <Icon name="search" ariaLabel="검색" 
            onClick={handleIconClick}
            style="w-5 h-5 text-page-font-tertiary cursor-pointer flex-shrink-0"/>
          <Input
            ref={inputRef}
            type="text"
            placeholder="전체 검색 (상품명, ID, 고객명 등)"
            className="w-[280px] pl-4 h-10 bg-gray-200 border-none relative"
          />
        </div> 

        <div className="flex items-center gap-2">
          <Button variant="light" className="py-5">상품 등록</Button>
          <Button variant="light" className="py-5">판매가 수정</Button>
          <Button variant="light" className="py-5">카테고리 수정</Button>
          <Button variant="light" className="py-5">옵션별칭 수정</Button>
        </div>
      </div>
    </>
  );
};