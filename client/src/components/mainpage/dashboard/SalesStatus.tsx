import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { salesData } from "@/mocks/dummy/status";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollTable } from "../common/ScrollTable";

export const SalesStatus = () => {
  const [activeTab, setActiveTab] = useState("금일");  
  const tabs = ["금일", "월별", "전일자"];
  const navigate = useNavigate();

  return (
    <StatusCard
      title="판매현황"
      onViewAll={() => navigate('/')}
    >
      <div className="flex space-x-2 py-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-0.5 text-sm border border-border-default rounded ${
              activeTab === tab
                ? "bg-page-blue-200 text-page-blue-400"
                : "bg-page-sidebar-bg text-page-font-tertiary hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
  
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-4 text-md text-page-font-primary pb-2">
          <span>품목코드</span>
          <span className="text-right">재고수량</span>
          <span className="text-right">재고금액</span>
        </div>
        
        <ScrollTable height="h-36">
          {salesData.map((item) => (
            <div key={item.id} className="grid grid-cols-3 gap-4 text-sm py-2">
              <span className="text-page-font-primary">{item.productCode}</span>
              <span className="text-right text-page-font-primary">{item.quantity.toLocaleString()}</span>
              <span className="text-right text-page-font-primary">{item.amount.toLocaleString()}...</span>
            </div>
          ))}
        </ScrollTable>
      </div>
    </StatusCard>
  );
};