import { Button } from "@/components/ui/Button";
import { useKeycloakAuth } from "@/hooks/useKeycloakAuth";
import { keycloakLogout } from "@/services/keycloakLogout";

const Main = () => {
  const { user } = useKeycloakAuth();

  const handleLogout = async () => {
      try {
        await keycloakLogout();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <div>
        <p>이메일: {user?.email || '이메일'}</p>
        <p>이름: {user?.name || '이름'}</p>
        <p>사용자 ID: {user?.sub || '사용자 아이디'}</p>
      </div>

      <Button onClick={handleLogout} type="submit">
        로그아웃
      </Button>
    </div>
  );
};

export default Main;