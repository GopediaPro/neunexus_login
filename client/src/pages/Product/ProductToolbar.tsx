import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";
import { useProductContext } from "@/api/context/ProductContext";
import { toast } from "sonner";
import { useProductImport } from "@/hooks/productManagement/useProductImport";
import { Dropdown } from "@/components/ui/Dropdown";
import { ChevronDown } from "lucide-react";
import { useProductGridActions } from "@/hooks/productManagement/useProductGridActions";

export const ProductToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    search,
    setSearch,
    activeProductTab,
    setActiveProductTab,
    gridApi,
    selectedRows,
    changedRows,
  } = useProductContext();

  const { handleFileImport, triggerFileUpload, isUploading } = useProductImport();
  const {
    addNewRow,
    deleteSelectedRows,
    selectAllRows,
    deselectAllRows,
    hasSelectedRows,
  } = useProductGridActions(gridApi);

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

  const handleAddSingleRow = async () => {
    try {
      await addNewRow();
      toast.success('새 행이 추가되었습니다.');
    } catch (error) {
      console.error('행 추가 실패:', error);
      toast.error('행 추가에 실패했습니다.');
    }
  };

  const handleRowDelete = async () => {
    try {
      if (!hasSelectedRows) {
        toast.error('삭제할 행을 선택해주세요.');
        return;
      }
      await deleteSelectedRows();
    } catch (error) {
      console.error('행 삭제 실패:', error);
    }
  };

  const handleProductRegister = async () => {
    if (!gridApi) return;
    
    const newRows = [];
    gridApi.forEachNode(node => {
      if (node.data && !node.data.id) {
        newRows.push(node.data);
      }
    });

    if (newRows.length === 0 && changedRows.length === 0) {
      toast.error('등록할 상품이 없습니다. 새 행을 추가하거나 기존 상품을 수정해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const productsToSave = [...newRows, ...changedRows];
      
      for (const product of productsToSave) {
        if (!product.goods_nm || !product.goods_price) {
          toast.error('상품명과 판매가격은 필수 입력 항목입니다.');
          setIsSaving(false);
          return;
        }

        const response = await fetch('/api/v1/product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        if (!response.ok) {
          throw new Error('상품 등록 실패');
        }
      }

      toast.success(`${productsToSave.length}개 상품이 성공적으로 등록되었습니다.`);
      
      if (gridApi) {
        gridApi.refreshCells();
      }
    } catch (error) {
      console.error('상품 등록 오류:', error);
      toast.error('상품 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRowItems = [
    {
      label: '행 1개 추가',
      onClick: handleAddSingleRow,
    },
    {
      label: '선택 행 삭제',
      onClick: handleRowDelete,
      disabled: !hasSelectedRows,
    },
    {
      label: '전체 선택',
      onClick: selectAllRows,
      disabled: !gridApi,
    },
    {
      label: '선택 해제',
      onClick: deselectAllRows,
      disabled: !hasSelectedRows,
    }
  ];

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
      <div className="flex items-center justify-between gap-2 px-6 pt-5 bg-fill-base-100">
        <div className="flex items-center gap-2">
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

          <Button 
            variant="light" 
            className={`py-5 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleProductRegister}
            disabled={isSaving}
          >
            <Icon name="plus" ariaLabel="plus" style="w-4 h-4" />
            {isSaving ? '등록 중...' : '상품 등록'}
          </Button>
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

        <Dropdown
          trigger={
            <Button 
              variant="light" 
              size="sidebar"
              className="py-5 flex items-center gap-1"
            >
              행 관리
              <ChevronDown size={24} className="text-text-base-400" />
            </Button>
          }
          items={handleRowItems}
          align="right"
        />
      </div>
    </>
  );
};