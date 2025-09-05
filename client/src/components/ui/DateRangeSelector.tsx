interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  disabled?: boolean;
  label?: string;
}

export const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false,
  label = "주문 날짜 설정"
}: DateRangeSelectorProps) => {
  return (
    <div className="mb-6 p-4 border border-stroke-base-200 rounded-lg bg-fill-base-50">
      <h3 className="text-h4 text-text-base-700 mb-3">{label}</h3>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col">
          <label className="text-body-s text-text-base-600 mb-1">시작 날짜</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-body-s text-text-base-600 mb-1">종료 날짜</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-3 py-2 border border-stroke-base-300 bg-inherit rounded text-body-m"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};