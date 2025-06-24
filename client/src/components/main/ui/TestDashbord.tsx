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
            <div className="tbl-wrap">
              <div className="tbl-head">
                <table className="tbl">
                  <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="text-left">품목코드</th>
                      <th className="text-right">재고수량</th>
                      <th className="text-right">재고금액</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="tbl-body">
                <table className="tbl">
                  <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="text-left">카카오</td>
                      <td className="text-right">576</td>
                      <td className="text-right">2,663,936</td>
                    </tr>
                    <tr>
                      <td className="text-left">카카오</td>
                      <td className="text-right">576</td>
                      <td className="text-right">2,663,936</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="card-right-wrap">
          <div className="card-title">
            <h3>재고현황</h3>
            <ViewAllButton />
          </div>
          <div className="card-body">
            <div className="tbl-wrap">
              <div className="tbl-head">
                <table className="tbl">
                  <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="text-left">품목코드</th>
                      <th className="text-right">재고수량</th>
                      <th className="text-right">재고금액</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="tbl-body">
                <table className="tbl">
                  <colgroup>
                    <col width="30%" />
                    <col width="30%" />
                    <col width="" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="text-left text-page-error">OCR-SNM1</td>
                      <td className="text-right">176</td>
                      <td className="text-right">2,663,936</td>
                    </tr>
                    <tr>
                      <td className="text-left text-page-error">OCT-4T19</td>
                      <td className="text-right">176</td>
                      <td className="text-right">2,663,936</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
