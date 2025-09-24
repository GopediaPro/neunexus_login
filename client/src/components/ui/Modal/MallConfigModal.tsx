import { useState } from "react";
import { Modal } from "@/components/ui/ModalComponent";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/Icon";
import { DEFAULT_MALL_CONFIG, MALL_CONFIG_ARRAY, type MallConfigs } from "@/constants/mallConfig";

interface MallConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (configs: MallConfigs) => void;
  initialConfigs?: MallConfigs;
}

export const MallConfigModal = ({
  isOpen,
  onClose,
  onApply,
  initialConfigs
}: MallConfigModalProps) => {
  const [configs, setConfigs] = useState<MallConfigs>(
    initialConfigs || { ...DEFAULT_MALL_CONFIG }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDiscountRateChange = (mallCode: string, value: string) => {
    const numValue = parseFloat(value);

    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 100)) {
      setConfigs(prev => ({
        ...prev,
        [mallCode]: {
          ...prev[mallCode],
          discountRate: value === '' ? 0 : numValue
        }
      }));

      if (errors[mallCode]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[mallCode];
          return newErrors;
        });
      }
    } else {
      setErrors(prev => ({
        ...prev,
        [mallCode]: '할인율은 0~100 사이의 숫자여야 합니다'
      }));
    }
  };

  const handleReset = () => {
    setConfigs({ ...DEFAULT_MALL_CONFIG });
    setErrors({});
  };

  const handleApply = () => {
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      return;
    }

    onApply(configs);
    onClose();
  };

  const handleClose = () => {
    setConfigs(initialConfigs || { ...DEFAULT_MALL_CONFIG });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <Modal.Header>
        <Modal.Title>쇼핑몰별 판매가 설정</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-text-base-500">
              각 쇼핑몰별 판매가 할인율을 설정하세요. (0~100%)
            </p>
            <Button
              variant="light"
              size="compact"
              onClick={handleReset}
            >
              <Icon name="refresh" style="w-4 h-4 mr-2" />
              기본값 초기화
            </Button>
          </div>

          <div className="border border-stroke-base-200 rounded-lg overflow-hidden">
            <div className="bg-fill-alt-100 px-4 py-3 border-b border-stroke-base-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-text-base-400">
                <div className="col-span-1">순번</div>
                <div className="col-span-2">쇼핑몰 코드</div>
                <div className="col-span-4">쇼핑몰명</div>
                <div className="col-span-3">할인율 (%)</div>
                <div className="col-span-2">상태</div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {MALL_CONFIG_ARRAY.map((mall, index) => (
                <div
                  key={mall.code}
                  className={`px-4 py-3 border-b border-stroke-base-100 last:border-b-0 ${
                    index % 2 === 0 ? 'bg-fill-base-100' : 'bg-fill-alt-100'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-sm text-text-base-500">
                      {index + 1}
                    </div>
                    <div className="col-span-2 text-sm font-mono text-text-base-400">
                      {mall.code}
                    </div>
                    <div className="col-span-4 text-sm text-text-base-400">
                      {mall.name}
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={configs[mall.code]?.discountRate || 0}
                          onChange={(e) => handleDiscountRateChange(mall.code, e.target.value)}
                          className={`text-right pr-8 ${
                            errors[mall.code] ? 'border-error-400 focus:border-error-500' : ''
                          }`}
                          placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-text-base-500">
                          %
                        </span>
                      </div>
                      {errors[mall.code] && (
                        <p className="text-xs text-error-500 mt-1">{errors[mall.code]}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        errors[mall.code]
                          ? 'bg-error-100 text-error-500'
                          : configs[mall.code]?.discountRate > 0
                          ? 'bg-accent-green-100 text-accent-green-500'
                          : 'bg-fill-alt-200 text-text-base-500'
                      }`}>
                        {errors[mall.code] ? (
                          <>
                            <Icon name="x" style="w-3 h-3 mr-1" />
                            오류
                          </>
                        ) : configs[mall.code]?.discountRate > 0 ? (
                          <>
                            <Icon name="check" style="w-3 h-3 mr-1" />
                            설정됨
                          </>
                        ) : (
                          <>
                            <Icon name="minus" style="w-3 h-3 mr-1" />
                            미설정
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-end gap-2">
          <Button variant="light" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="default"
            onClick={handleApply}
            disabled={Object.keys(errors).length > 0}
          >
            적용
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};