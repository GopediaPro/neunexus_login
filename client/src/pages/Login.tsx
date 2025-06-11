import { useNavigate } from 'react-router-dom'; // 1. 네비게이트 가져오기

const Login = () => {
  const navigate = useNavigate(); // 2. 훅 사용

  const handleSignUpClick = () => {
    navigate('/signup'); // 3. 클릭 시 이동할 경로
  };

  return (
    <div className="flex items-center justify-between px-4 py-2">
  <h1 className="text-xl">로그인 페이지</h1>
  <button
    className="text-sm text-gray-600 hover:text-blue-600"
    onClick={handleSignUpClick}
  >
    회원가입으로 이동
  </button>
</div>

  );
};

export default Login;
