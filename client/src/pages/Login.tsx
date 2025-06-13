import { useNavigate } from "react-router-dom"
import { CtaButton } from "../components/ui/cta-button"

const Login = () => {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    console.log("로그인 버튼 클릭됨!")
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">로그인 페이지</h1>
      <CtaButton
        text="로그인"
        onClick={handleLoginClick}
      />
    </div>
  )
}

export default Login
