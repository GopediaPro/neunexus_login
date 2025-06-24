import { CSStatus } from "@/components/main/ui/CSStatus";
import { InventoryStatus } from "@/components/main/ui/InventoryStatus";
import { ProductStatus } from "@/components/main/ui/ProductStatus";
import { SalesStatus } from "@/components/main/ui/SalesStatus";

export const Dashboard = () => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2">
        <SalesStatus />
        <InventoryStatus />
      </div>
      
      <div className="grid grid-cols-2">
        <CSStatus />
        <ProductStatus />
      </div>
    </div>
  );
};