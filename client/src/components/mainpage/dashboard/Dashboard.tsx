import { CSStatus } from "@/components/mainpage/dashboard/CSStatus";
import { InventoryStatus } from "@/components/mainpage/dashboard/InventoryStatus";
import { ProductStatus } from "@/components/mainpage/dashboard/ProductStatus";
import { SalesStatus } from "@/components/mainpage/dashboard/SalesStatus";

export const Dashboard = () => {
  return (
    <div className="flex flex-col border rounded-[10px] overflow-hidden">
      <div className="grid grid-cols-2">
        <div className="relative">
          <SalesStatus />
          <div className="absolute right-0 top-5 bottom-0 border-r-2 border-border-default" />
        </div>
        <InventoryStatus />
      </div>
      
      <div className="grid grid-cols-2">
        <div className="relative">
          <CSStatus />
          <div className="absolute right-0 top-0 bottom-5 border-r-2 border-border-default" />
        </div>
        <ProductStatus />
      </div>
    </div>
  );
};