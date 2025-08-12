import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";
import { useProductContext } from "@/api/context/ProductContext";
import { toast } from "sonner";
import { useProductImport } from "@/hooks/productManagement/useProductImport";

export const ProductToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);

  const {
    search,
    setSearch,
    activeProductTab,
    setActiveProductTab,
  } = useProductContext();

  const { handleFileImport, triggerFileUpload, isUploading } = useProductImport();

  const handleIconClick = () => {
    inputRef.current?.focus();
  };

  const handleExcelImport = () => {
    triggerFileUpload(async (file: File) => {
      setIsImporting(true);
      
      try {
        const result = await handleFileImport(file, '상품등록');
        
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        alert('업로드 중 예상치 못한 오류가 발생했습니다.');
        console.error('Upload error:', error);
      } finally {
        setIsImporting(false);
      }
    });
  };

  return (
    <>
      <div className="bg-fill-base-100">
        <div className="px-6">
          <div className="flex gap-2 border-b border-stroke-base-100">
            <button className="px-4 py-4 text-primary-500 bg-fill-base-100 text-h2 border-b-2 border-primary-500">상품관리</button>
            <button onClick={() => navigate(ROUTERS.ORDER_MANAGEMENT)} className="px-4 py-4 text-text-base-400 text-h2 hover:text-primary-500 hover:bg-fill-alt-100 transition-colors">주문관리</button>
          </div>
        </div>
        <div className="flex gap-4 pt-6 px-6 bg-fill-base-100">
          <Button
            onClick={() => setActiveProductTab("registration")}
            variant="light"
            className={`border border-stroke-base-100 transition-colors ${
              activeProductTab === "registration"
                ? "bg-primary-400 text-text-contrast-500 hover:bg-primary-500"
                : "text-text-base-300 hover:text-text-base-400 bg-stroke-base-100 hover:bg-stroke-base-200"
            }`}>
            상품등록
          </Button>
          <Button
            onClick={() => setActiveProductTab("bulk-registration")}
            variant="light"
            className={`border border-stroke-base-100 transition-colors ${
              activeProductTab === "bulk-registration"
                ? "bg-primary-400 text-text-contrast-500 hover:bg-primary-500"
                : "text-text-base-300 hover:text-text-base-400 bg-stroke-base-100 hover:bg-stroke-base-200"
            }`}>
            대량상품등록
          </Button>
        </div>
        <div className="mt-6 px-6">
          <span className="text-h2">상품등록</span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-6 pt-5 bg-fill-base-100">
        <div className="flex items-center w-[320px] h-12 bg-fill-alt-100 rounded-md pl-2">
          <Icon name="search" ariaLabel="검색"
            onClick={handleIconClick}
            style="w-5 h-5 text-text-base-400 cursor-pointer flex-shrink-0"/>
          <Input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="전체 검색 (상품명, ID, 고객명 등)"
            className="w-[280px] pl-4 bg-fill-alt-100 border-none relative h-12"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="light" className="py-5">상품 등록</Button>
          <Button 
            variant="light" 
            className="py-5 flex items-center gap-2" 
            onClick={handleExcelImport}
            disabled={isUploading || isImporting}
          >
            {(isUploading || isImporting) ? (
              <>
                <Icon name="loader" style="w-4 h-4 animate-spin" />
                업로드 중...
              </>
            ) : (
              <>
                <Icon name="upload" style="w-4 h-4" />
                엑셀 업로드
              </>
            )}
          </Button>
          <Button variant="light" className="py-5">카테고리 수정</Button>
          <Button variant="light" className="py-5">옵션별칭 수정</Button>
        </div>
      </div>
    </>
  );
};