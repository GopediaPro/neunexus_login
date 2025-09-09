import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/constant/route";
import { useProductContext } from "@/api/context/ProductContext";
import { useProductImport } from "@/hooks/productManagement/useProductImport";
import { useProductGridActions } from "@/hooks/productManagement/useProductGridActions";
import { useProductsCreate } from "@/api/product/createProducts";
import { useProductUpdate } from "@/api/product/updateProducts";
import { useProductDelete } from "@/api/product/deleteProducts";
import type { ProductFormData, ProductUpdateFormData } from "@/api/types";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setIsProcessing(false);
    },
    onError: (error) => {
      setIsProcessing(false);
    }
  });

  const updateProductsMutation = useProductUpdate({
    onSuccess: (response) => {
      if (gridApi) {
        gridApi.refreshCells();
        gridApi.deselectAll();
      }
      setIsProcessing(false);
    },
    onError: (error) => {
      setIsProcessing(false);
    }
  });

  const deleteProductsMutation = useProductDelete({
    onSuccess: (response) => {
      if (gridApi) {
        gridApi.refreshCells();
        gridApi.deselectAll();
      }
      setIsDeleting(false);
    },
    onError: (error) => {
      setIsDeleting(false);
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
        toast.error('업로드 중 예상치 못한 오류가 발생했습니다.');
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
    await handleProductDelete();
  };

  const handleProductRegister = async () => {
    if (createProductsMutation.isPending || isProcessing) {
      return;
    }

    setIsProcessing(true);

    if (!gridApi) {
      setIsProcessing(false);
      return;
    }

    try {
      const newRows: ProductFormData[] = [];
      const modifiedRows: ProductUpdateFormData[] = [];
      
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
        // 모든 toast 제거 후 새로 표시
        toast.dismiss();
        setTimeout(() => {
          toast.error('등록할 상품이 없습니다. 새 행을 추가하거나 기존 상품을 수정해주세요.');
        }, 100);
        setIsProcessing(false);
        return;
      }

      // 유효성 검사
      const validation = validateProducts(allProductsToRegister);
      if (!validation.success) {
        // 모든 toast 제거 후 새로 표시
        toast.dismiss();
        setTimeout(() => {
          toast.error(validation.error);
        }, 100);
        setIsProcessing(false);
        return;
      }

      // 등록/수정 분리
      if (newRows.length > 0) {
        // 유효성 검사
        const newValidation = validateProducts(newRows);
        if (!newValidation.success) {
          toast.dismiss();
          setTimeout(() => {
            toast.error(newValidation.error);
          }, 100);
          setIsProcessing(false);
          return;
        }
        
        // 새 상품 등록
        createProductsMutation.mutate(newRows);
      }

      if (modifiedRows.length > 0) {
        // 유효성 검사  
        const modifiedValidation = validateProducts(modifiedRows);
        if (!modifiedValidation.success) {
          toast.dismiss();
          setTimeout(() => {
            toast.error(modifiedValidation.error);
          }, 100);
          setIsProcessing(false);
          return;
        }
        
        // 기존 상품 수정
        const updateRequest = {
          data: modifiedRows,
          metadata: {
            request_id: `update-${Date.now()}`
          }
        };
        updateProductsMutation.mutate(updateRequest);
      }
      
    } catch (error) {
      toast.error('상품 등록 오류가 발생했습니다');
      setIsProcessing(false);
    }
  };

  const handleProductDelete = async () => {
    if (deleteProductsMutation.isPending || isDeleting) {
      return;
    }

    if (!gridApi) {
      toast.error('그리드를 초기화할 수 없습니다.');
      return;
    }

    const selectedRowsData = gridApi.getSelectedRows();
    
    if (selectedRowsData.length === 0) {
      toast.error('삭제할 상품을 선택해주세요.');
      return;
    }

    // 새로 추가된 행(아직 저장되지 않은 행)과 기존 행 분리
    const unsavedRows = selectedRowsData.filter(row => 
      !row.id || row.id.toString().startsWith('new_')
    );
    const savedRows = selectedRowsData.filter(row => 
      row.id && !row.id.toString().startsWith('new_')
    );

    const confirmMessage = `선택한 ${selectedRowsData.length}개 상품을 삭제하시겠습니까?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      // 저장되지 않은 행은 그리드에서만 제거
      if (unsavedRows.length > 0) {
        gridApi.applyTransaction({
          remove: unsavedRows
        });
      }

      // 저장된 행은 서버에서 삭제
      if (savedRows.length > 0) {
        const deleteRequest = {
          data: savedRows.map(row => ({ id: Number(row.id) })),
          metadata: {
            request_id: `delete-${Date.now()}`
          }
        };
        deleteProductsMutation.mutate(deleteRequest);
      } else if (unsavedRows.length > 0) {
        // 저장되지 않은 행만 있는 경우
        toast.success(`${unsavedRows.length}개 행이 삭제되었습니다.`);
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error('상품 삭제 오류가 발생했습니다.');
      setIsDeleting(false);
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
      disabled: !hasSelectedRows || deleteProductsMutation.isPending || isDeleting,
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