import { useState } from "react";
import { FormField } from "../ui/FormField";
import { useForm } from "react-hook-form";
import { SelectSearchInput } from "./common/SelectSearchInput";
import { ruleOptions } from "@/mocks/dummy/rule";
import { Select } from "../ui/Select";
import { sectionOptions } from "@/constant";
import { Textarea } from "../ui/Textarea";

interface RuleFormData {
  selectedTool: string;
  selectedSection: string;
  ruleValue: string;
}

export const RuleEditContainer = () => {
  const [testResult, setTestResult] = useState('');
  const [isTestSuccess, setIsTestSuccess] = useState(false);
  const [inputData, _setInputData] = useState(`{ "goods_nm": "맛있는 사과", "model_code": "A-123",
    "goods_price": 5000, "char_1_nm": "색상",
    "char_1_val": "빨강" }`)

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<RuleFormData>({
    defaultValues: {
      selectedTool: '상품명 (product name)',
      selectedSection: '마스터',
      ruleValue: '"{goods_nm} {model_code}"'
    }
  });

  const watchedValues = watch();

  const handleReset = () => {
    setValue('ruleValue', '"{goods_nm} {model_code}"');
    setTestResult('');
    setIsTestSuccess(false);
  };

  const handleTest = () => {
    // 테스트 로직 시뮬레이션
    setTestResult('"맛있는 사과 A-123"');
    setIsTestSuccess(true);
  };

  const handleSave = (_data: RuleFormData) => {
    // 저장 로직
  };

  const handleImport = () => {
    // 불러오기 로직
  };

  return (
    <div className="flex border border-border-default rounded-[10px] bg-page-card-bg overflow-hidden min-h-[683px]">
      <div className="flex-1 p-6 bg-white border-r border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
            🔧 룰 편집기
          </h2>
          <p className="text-gray-600">룰을 선택하고 값을 수정해주세요.</p>
        </div>

        <div className="p-6 border border-border-default rounded-[10px]">
          <form onSubmit={handleSubmit(handleSave)}>
            <div className="space-y-6">
            <FormField
                name="selectedTool"
                control={control}
                label="룰 선택"
                error={errors.selectedTool?.message}
                render={field => (
                  <SelectSearchInput
                    options={ruleOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="룰을 선택하세요"
                  />
                )}
              />

              <FormField
                name="selectedSection"
                control={control}
                label="구분"
                error={errors.selectedSection?.message}
                render={field => (
                  <Select
                    options={sectionOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.selectedSection}
                  />
                )}
              />

              <FormField
                name="ruleValue"
                control={control}
                label="룰 값"
                error={errors.ruleValue?.message}
                render={field => (
                  <Textarea
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="중괄호 안에 변수를 수정하세요."
                    variant="code"
                    rows={4}
                    helperText="중괄호 안에 변수를 수정하세요."
                    error={!!errors.ruleValue}
                  />
                )}
              />
            </div>

          </form>

          <div className="flex gap-3 mt-6">
            <button 
              type="button"
              onClick={handleImport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              룰 불러오기
            </button>
            <button 
              type="button"
              onClick={handleSubmit(handleSave)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              변경사항 저장
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-gray-800 mb-3">현재 룰 정보</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">선택된 룰:</span>
                <span className="text-sm font-medium">{watchedValues.selectedTool} ({watchedValues.selectedSection})</span>
              </div>
              <div className="bg-gray-800 text-green-400 p-3 rounded-lg font-mono text-sm">
                {watchedValues.ruleValue}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
            📊 룰 테스트
          </h2>
          <p className="text-gray-600">입력한 룰이 상품 데이터에 적용된 결과를 확인할 수 있습니다.</p>
        </div>

        <div className="space-y-6 border border-border-default rounded-[10px] p-4 min-h-[683px] bg-gray-50">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              입력 데이터
            </label>
            <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
              {inputData}
            </div>
            <p className="text-sm text-gray-500 mt-1">JSON 형식으로 테스트할 데이터를 입력하세요.</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">실행 파라미터</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="selectedTool"
                control={control}
                label="룰 선택"
                error={errors.selectedTool?.message}
                render={() => (
                  <Select
                    options={[{ value: watchedValues.selectedTool, label: watchedValues.selectedTool }]}
                    value={watchedValues.selectedTool}
                    disabled
                  />
                )}
              />
              <FormField
                name="selectedSection"
                control={control}
                label="구분"
                error={errors.selectedSection?.message}
                render={() => (
                  <Select
                    options={[{ value: watchedValues.selectedSection, label: watchedValues.selectedSection }]}
                    value={watchedValues.selectedSection}
                    disabled
                  />
                )}
              />
            </div>
            
            <div className="flex gap-3 mt-4">
              <button 
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                초기화
              </button>
              <button 
                onClick={handleTest}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                테스트 실행
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">실행 결과</h3>
            {isTestSuccess && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-green-800 font-medium">테스트 실행 성공</span>
                  <span className="ml-auto text-green-600 text-sm">실행 시간: -ms</span>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-800 font-mono text-sm">
                    {testResult}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};