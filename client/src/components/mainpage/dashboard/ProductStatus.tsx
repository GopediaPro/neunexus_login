import { StatusCard } from "@/components/mainpage/common/StatusCard";
import { productData } from "@/mocks/dummy/status";
import { useNavigate } from "react-router-dom";

export const ProductStatus = () => {
  const navigate = useNavigate();
  const labels = ["전체상품", "공급중", "일시중지", "완전품절"];

  return (
    <StatusCard
      title="상품현황"
      onViewAll={() => navigate('/')}
    >
      <div className="space-y-4 mt-2">
        {productData.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between">
            <span className="text-text-base-500 text-body-l">{labels[index]}</span>
            <span className="text-body-l text-primary-500">
              {item.value.toLocaleString()} 건
            </span>
          </div>
        ))}
      </div>
    </StatusCard>
  );
};