import { OpthionBar } from '@/components/ui/OpthionBar'
import { useState } from 'react';
import { useOrderCreateFromReceive } from '@/api/order/postOrderCreate';
import { Button } from '@/components/ui/Button';
import { SelectSearchInput } from '@/components/management/common/SelectSearchInput';
import { companyOptions, fldDspOptions, statusOptions } from '@/constants/order';

export const OrderSabangNetMenu = () => {
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [dpartnerId, setDpartnerId] = useState<string>('오케이마트');
  const [fldDsp, setFldDsp] = useState<string>('G마켓2.0');
  const [orderStatus, setOrderStatus] = useState<string>('출고완료');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const orderCreateMutation = useOrderCreateFromReceive({
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  const handleOrderInquiry = async () => {
    if (!dateFrom || !dateTo) {
      return;
    }

    setIsLoading(true);

    const requestData = {
      data: {
        filters: {
          date_from: dateFrom,
          date_to: dateTo,
          dpartner_id: dpartnerId,
          fld_dsp: fldDsp,
          order_status: orderStatus
        }
      },
      metadata: {
        request_id: `order_inquiry_${Date.now()}`
      }
    };

    orderCreateMutation.mutate(requestData);
  };

  return (
    <section className="px-6 py-4 bg-fill-base-100">
      <OpthionBar>
        <section className="grid grid-cols-3 gap-4">
          <OpthionBar.Section title="일자정보" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={1} gap={2}>
                <OpthionBar.Field label="시작일자" labelWidth={50}>
                  <OpthionBar.Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
              <OpthionBar.Row columns={1} gap={2}>
                <OpthionBar.Field label="종료일자" labelWidth={50}>
                  <OpthionBar.Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="text-[10px] h-5 px-1 border-none bg-transparent"
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>

          <OpthionBar.Section title="배송업체" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={1} gap={2}>
                <OpthionBar.Field label="업체선택" labelWidth={50}>
                  <select 
                    value={dpartnerId}
                    onChange={(e) => setDpartnerId(e.target.value)}
                    className="w-full text-[10px] h-5 bg-transparent text-text-contrast-500 border-none appearance-none px-1 focus:outline-none"
                  >
                    {companyOptions.map((option) => (
                      <option 
                        key={option.id} 
                        value={option.label} 
                        className="bg-text-base-500 text-text-contrast-500"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </OpthionBar.Field>
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>

          <OpthionBar.Section title="주문상태" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={1} gap={2}>
                <OpthionBar.Field label="상태" labelWidth={30}>
                  <select 
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full text-[10px] h-5 bg-transparent text-text-contrast-500 border-none appearance-none px-1 focus:outline-none"
                  >
                    {statusOptions.map((option) => (
                      <option 
                        key={option.id} 
                        value={option.label} 
                        className="bg-text-base-500 text-text-contrast-500"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </OpthionBar.Field>
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>
        </section>
        <OpthionBar.Divider />

        <section className="grid grid-cols-2 gap-4">
          <OpthionBar.Section title="쇼핑몰" titleColWidth={60}>
            <OpthionBar.Column gap={2}>
              <OpthionBar.Row columns={1} gap={2}>
                <OpthionBar.Field label="몰 선택" labelWidth={50}>
                  <SelectSearchInput
                    options={fldDspOptions}
                    value={fldDsp}
                    onChange={(value) => setFldDsp(value)}
                  />
                </OpthionBar.Field>
              </OpthionBar.Row>
            </OpthionBar.Column>
          </OpthionBar.Section>
        </section>
      </OpthionBar>
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleOrderInquiry}
          disabled={isLoading || !dateFrom || !dateTo}
          className={`text-[10px] h-5 px-2 flex-shrink-0 ${
            isLoading || !dateFrom || !dateTo
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? '조회중...' : '주문 수집'}
        </Button>
      </div>
    </section>
  )
}