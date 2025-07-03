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
      <Input
        ref={inputRef}
        type="text"
        placeholder="전체 검색 (상품명, ID, 고객명 등)"
        className="w-[320px] pl-12 h-10 bg-gray-200 border-none relative"
      /> 
      <Icon name="search" ariaLabel="검색" 
        onClick={handleIconClick}
        style="absolute left-9 w-6 h-6 text-page-font-tertiary cursor-pointer" />
      <div className="flex items-center gap-2">
        <Button variant="light" className="py-5">상품 등록</Button>
        <Button variant="light" className="py-5">판매가 수정</Button>
        <Button variant="light" className="py-5">카테고리 수정</Button>
        <Button variant="light" className="py-5">옵션별칭 수정</Button>
      </div>
    </div>
  );
};