import { Button } from "@/components/ui/Button";

export const AuthForm = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">로그인</h2>

      {/* 로그인 버튼 */}
      <Button className="w-full bg-black text-white hover:bg-gray-800">
        로그인
      </Button>
    </div>
  );
};