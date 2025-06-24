import { MenuBox } from "@/components/main/MenuBox";
import { useNavigate } from "react-router-dom";

export const ContentLayout = () => {
  const navigate = useNavigate();
  return (
    <main className="flex-1 p-6">
      <div className="space-y-6">
        <MenuBox 
          icon={<img src="/image/alert.svg" className="w-6 h-6" />}
          label="운송장 출력"
          onClick={() => navigate('/')}
        />
      </div>
    </main>
  );
};