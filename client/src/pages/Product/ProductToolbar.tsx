import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";
import { useProductContext } from "@/api/context/ProductContext";
import { useProductImport } from "@/hooks/productManagement/useProductImport";
import { useProductGridActions } from "@/hooks/productManagement/useProductGridActions";
import { useProductsCreate } from "@/api/product/createProducts";
import type { ProductFormData } from "@/api/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/Dropdown";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { validateProducts } from "@/schemas";

export const ProductToolbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);

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

  const createProductsMutation = useProductsCreate({
    onSuccess: (response) => {
      if (gridApi) {
        gridApi.refreshCells();
        gridApi.deselectAll();
      }
      
      if (response.data?.created_ids && response.data.created_ids.length > 0) {
        console.log('생성된 상품 ID:', response.data.created_ids);
      }
    }
  });

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
      toast.error('행 삭제에 실패했습니다.')
    }
  };

  const handleProductRegister = async () => {
    if (!gridApi) return;
    
    const newRows: ProductFormData[] = [];
    const modifiedRows: ProductFormData[] = [];
    
    gridApi.forEachNode(node => {
      if (node.data) {
        if (!node.data.id || node.data.id.toString().startsWith('new_')) {
          newRows.push(node.data);
        }
      }
    });

    changedRows.forEach(row => {
      if (row && row.id && !row.id.toString().startsWith('new_')) {
        modifiedRows.push(row);
      }
    });

    const allProductsToRegister = [...newRows, ...modifiedRows];

    if (allProductsToRegister.length === 0) {
      toast.error('등록할 상품이 없습니다. 새 행을 추가하거나 기존 상품을 수정해주세요.');
      return;
    }

    // 유효성 검사
    const validation = validateProducts(allProductsToRegister);
    if (!validation.success) {
      toast.error(validation.error);
      return;
    }

    // 임시로 goods_nm만 검사 (그리드의 필드명)
    // const invalidProducts = allProductsToRegister.filter(product => {
    //   return !product.goods_nm?.trim();
    // });

    // if (invalidProducts.length > 0) {
    //   toast.error('제품명(goods_nm)은 필수 입력 항목입니다.');
    //   return;
    // }
  

    // TODO: 추후 전체 필수 필드 검증 활성화
    // const invalidProducts = allProductsToRegister.filter(product => {
    //   return !product.product_nm?.trim() || 
    //          !product.goods_nm?.trim() || 
    //          typeof product.goods_price !== 'number' || 
    //          product.goods_price < 0 ||
    //          typeof product.delv_cost !== 'number' ||
    //          !product.goods_search?.trim() ||
    //          !product.certno?.trim() ||
    //          !product.detail_path_img?.trim() ||
    //          !product.img_path?.trim() ||
    //          !product.stock_use_yn?.trim() ||
    //          !product.class_nm1?.trim();
    // });

    // if (invalidProducts.length > 0) {
    //   toast.error('필수 입력 항목을 모두 입력해주세요. (상품명, 굿즈명, 판매가격, 배송비, 검색어, 인증번호, 이미지 경로, 재고사용여부, 카테고리1)');
    //   return;
    // }

    createProductsMutation.mutate(allProductsToRegister);
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
            className={`py-5 ${createProductsMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleProductRegister}
            disabled={createProductsMutation.isPending}
          >
            <Icon name="plus" ariaLabel="plus" style="w-4 h-4" />
            {createProductsMutation.isPending ? '등록 중...' : '상품 등록'}
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