import { useRef } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";

export const OrderToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const naviagte = useNavigate();

  const handleIconClick = () => {
    inputRef.current?.focus();
  }

  return (
    <>
      <div>
        <div className="px-6 bg-fill-base-200">
          <div className="flex gap-2 border-b">
            <button onClick={() => naviagte(ROUTERS.PRODUCT_MANAGAMENT)} className="px-4 py-2 text-text-base-400 text-h3 hover:text-primary-500 hover:bg-fill-alt-100 transition-colors">상품관리</button>
            <button className="px-4 py-4 text-primary-500 bg-fill-base-100 text-h3 border-b-2 border-primary-500">주문관리</button>
          </div>
        </div>
        <div className="flex gap-4 pt-6 px-6 bg-fill-base-100">
          <Button 
            size="lg" 
            className={`border border-stroke-base-100 transition-colors`}>
            주문등록
          </Button>
          <Button 
            size="lg" 
            className={`border border-stroke-base-100 transition-colors`}>
            대량주문등록
          </Button>
        </div>
        <div className="mt-6 px-6">
          <span className="text-h2">주문목록</span>
        </div>
      </div>
      <div className="flex items-center gap-4 px-6 pt-5 bg-fill-base-100">
        <div className="flex items-center w-[320px] h-10 bg-fill-alt-100 rounded-md px-3">
          <Icon name="search" ariaLabel="검색" 
            onClick={handleIconClick}
            style="w-5 h-5 text-text-base-400 cursor-pointer flex-shrink-0"/>
          <Input
            ref={inputRef}
            type="text"
            placeholder="전체 검색 (상품명, ID, 고객명 등)"
            className="w-[280px] pl-4 h-10 bg-fill-alt-100 border-none relative"
          />
        </div> 

        <div className="flex items-center gap-2">
          <Button variant="light" className="py-5">주문 등록</Button>
          <Button variant="light" className="py-5">판매가 수정</Button>
          <Button variant="light" className="py-5">카테고리 수정</Button>
          <Button variant="light" className="py-5">옵션별칭 수정</Button>
        </div>
      </div>
    </>
  );
};