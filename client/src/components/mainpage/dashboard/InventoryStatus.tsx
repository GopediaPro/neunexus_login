import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { inventoryData } from "@/mocks/dummy/status";
import { useNavigate } from "react-router-dom";
import { ScrollTable } from "../common/ScrollTable";

export const InventoryStatus = () => {
  const navigate = useNavigate();

  return (
    <StatusCard
      title="재고현황"
      onViewAll={() => navigate('/')}
    >
      <div className="grid grid-cols-3 gap-4 text-h6 text-text-base-500 pt-2 py-4">
        <span>품목코드</span>
        <span className="text-right">재고수량</span>
        <span className="text-right">재고금액</span>
      </div>
      
      <ScrollTable height="h-48">
        {inventoryData.map((item) => (
          <div key={item.id} className="grid grid-cols-3 gap-4 text-body-s py-2">
            <span 
              className="text-text-base-500">
              {item.productCode}
            </span>
            <span className="text-right text-text-base-500">{item.quantity}</span>
            <span className="text-right text-text-base-500">{item.amount.toLocaleString()}...</span>
          </div>
        ))}
      </ScrollTable>
    </StatusCard>
  );
};