import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { BulkUploadModal } from "./ui/Modal/BulkUploadModal";
import { FormField } from "./ui/FormField";

interface AuthTableRow {
  id: number;
  authTableName: string;
  mallId: string;
  exceptionName: string;
}

interface FormData {
  authTable: AuthTableRow[];
}

export const TestComponent = () => { 
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      authTable: [
        { id: 1, authTableName: "", mallId: "saban0001", exceptionName: "취급금지상품" },
        { id: 2, authTableName: "", mallId: "saban0002", exceptionName: "몰운영 인기사진 적용인증" },
        { id: 3, authTableName: "", mallId: "saban0002", exceptionName: "상세페이지지침조" }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "authTable"
  });

  const handleAddRow = () => {
    const newId = Math.max(...fields.map(field => field.id), 0) + 1;
    append({ 
      id: newId, 
      authTableName: "", 
      mallId: "", 
      exceptionName: "" 
    });
  };

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h4">인증기준 예외 관리 테이블</h2>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowBulkUploadModal(true)}
          className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200"
        >
          📁 대량파일 업로드
        </Button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border border-stroke-base-100 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 bg-fill-alt-100 border-b border-stroke-base-100">
            <div className="p-3 text-center font-medium border-r border-stroke-base-100">ID</div>
            <div className="p-3 text-center font-medium border-r border-stroke-base-100 bg-fill-alt-100">인증테이블</div>
            <div className="p-3 text-center font-medium border-r border-gray-300">쇼핑몰ID</div>
            <div className="p-3 text-center font-medium bg-fill-alt-100">예외처리명칭</div>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 border-b border-stroke-base-100 last:border-b-0">
              <div className="p-3 flex items-center justify-center border-r border-stroke-base-100">
                <span className="text-sm">{field.id}</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-2 text-error-500 hover:text-error-700"
                  title="행 삭제"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-2 border-r border-stroke-base-100">
                <FormField
                  name={`authTable.${index}.authTableName`}
                  control={control}
                  render={field => (
                    <Input
                      value={field.value as string}
                      onChange={field.onChange}
                      placeholder="인증테이블명"
                      className="w-full border-0 p-1 text-sm"
                    />
                  )}
                />
              </div>
              
              <div className="p-2 border-r border-stroke-base-100">
                <FormField
                  name={`authTable.${index}.mallId`}
                  control={control}
                  render={field => (
                    <Input
                      value={field.value as string}
                      onChange={field.onChange}
                      placeholder="쇼핑몰ID"
                      className="w-full border-0 p-1 text-sm"
                    />
                  )}
                />
              </div>
              
              <div className="p-2">
                <FormField
                  name={`authTable.${index}.exceptionName`}
                  control={control}
                  render={field => (
                    <Input
                      value={field.value as string}
                      onChange={field.onChange}
                      placeholder="예외처리명칭"
                      className="w-full border-0 p-1 text-sm"
                    />
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddRow}
            className="px-4 py-2"
          >
            + 행 추가
          </Button>
          
          <Button
            type="submit"
            variant="default"
            className="px-4 py-2 bg-primary-500 text-text-contrast-500"
          >
            저장
          </Button>
        </div>
      </form>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
      />
    </div>
  );
};
