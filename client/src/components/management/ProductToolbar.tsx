import { useRef } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Input } from "../ui/input";

export const ProductToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    inputRef.current?.focus();
  }

  return (
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
  );
};