import { useAuthWithKeycloak } from "@/hooks/useAuthWithKeycloak";

const Main = () => {
  const { user } = useAuthWithKeycloak();

  return (
    <div>
      <div>
        <p>이메일: {user?.email || '이메일'}</p>
        <p>이름: {user?.name || '이름'}</p>
        <p>사용자 ID: {user?.sub || '사용자 아이디'}</p>
      </div>
    </div>
  );
};

export default Main;