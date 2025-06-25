import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { inventoryData } from "@/mocks/dummy/status";
import { useNavigate } from "react-router-dom";

export const InventoryStatus = () => {
  const navigate = useNavigate();

  return (
    <StatusCard
      title="재고현황"
      onViewAll={() => navigate('/')}
    >
      <div className="grid grid-cols-3 gap-4 text-md font-semibold text-page-font-secondary pt-2 py-4">
        <span>품목코드</span>
        <span className="text-right">재고수량</span>
        <span className="text-right">재고금액</span>
      </div>
      
      {inventoryData.map((item) => (
        <div key={item.id} className="grid grid-cols-3 gap-4 text-sm py-2">
          <span 
            className="text-page-error">
            {item.productCode}
          </span>
          <span className="text-right text-page-font-primary">{item.quantity}</span>
          <span className="text-right text-page-font-primary">{item.amount.toLocaleString()}...</span>
        </div>
      ))}
    </StatusCard>
  );
};