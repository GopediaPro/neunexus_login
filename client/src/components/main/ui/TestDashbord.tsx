import { useState } from 'react';
import { CSStatus } from '@/components/main/ui/CSStatus';
import { InventoryStatus } from '@/components/main/ui/InventoryStatus';
import { ProductStatus } from '@/components/main/ui/ProductStatus';
import { SalesStatus } from '@/components/main/ui/SalesStatus';
import { ViewAllButton } from '@/components/main/ui/ViewAllButton';

export const TestDashboard = () => {
  const [activeTab, setActiveTab] = useState('금일');
  const tabs = ['금일', '월별', '전일자'];
  return (
    <div className="card">
      <div className="flex">
        <div className="card-left-wrap">
          <div className="card-title">
            <h3>판매현황</h3>
            <ViewAllButton />
          </div>
          <div className="card-body">
            <div className="card-tab">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`card-tab-button ${
                    activeTab === tab ? 'active' : 'hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-right-wrap">
          <div className="card-title">
            <h3>재고현황</h3>
            <ViewAllButton />
          </div>
        </div>
      </div>
    </div>
  );
};
