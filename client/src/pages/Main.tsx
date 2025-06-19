import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useKeycloakAuth } from "@/hooks/useKeycloakAuth";
import { keycloakLogout } from "@/services/keycloakLogout";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
  const { user } = useKeycloakAuth();

  const handleLogout = async () => {
    try {
      await keycloakLogout();
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-5">
      <div className="">
        <p>이메일: {user?.email || '이메일'}</p>
        <p>사용자 ID: {user?.sub || '사용자 아이디'}</p>
      </div>

      <div className="flex gap-5">
        <Button onClick={() => navigate('/login')}>
          로그인 페이지
        </Button>
        <Button onClick={() => navigate('/signup')}>
          회원가입 페이지
        </Button>
        <Button onClick={handleLogout} type="submit">
          로그아웃
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Main;