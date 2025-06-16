import { useNavigate } from 'react-router-dom';
import { Button } from '../components/auth/Button'; // ✅ 이거로 고쳐줘!

const Login = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="relative p-4">
      <h1 className="text-xl mb-4">로그인 페이지</h1>

      <Button
        variant="primary"
        onClick={handleSignUpClick}
        className="absolute top-4 right-4"
      >
        회원가입으로 이동
      </Button>
    </div>
  );
};

export default Login;
