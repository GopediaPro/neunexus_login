import { AuthForm } from "@/components/auth/AuthForm"  // 🔥 진짜 로그인 폼 import

const Login = () => {
  return (
    <div className="p-4">
      <AuthForm />  {/* ✅ 진짜 로그인 폼 사용 */}
    </div>
  )
}

export default Login
