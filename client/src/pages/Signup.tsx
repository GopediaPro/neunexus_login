import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/schemas";
import { keycloakSignup } from "@/services/keycloakSignup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";

export type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<SignupFormData>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
        email: "",
        password: "",
        username: ""
      }
    });
  
    const onSubmit = async (data: SignupFormData) => {
      try {
        const result = await keycloakSignup(data);
        
        if (result.success) {
          if (result.autoLogin) {
            navigate('/');
          } else {
            navigate('/login');
          }
        }
      } catch (error: any) {
        setError("root", {
          type: "manual",
          message: error.message || "로그인 실패"
        });
      }
    };

  return (
    <div className="w-full h-screen bg-web-background flex justify-center items-center">
      <div className="w-[590px] p-24 bg-font-white dark:bg-web-primary rounded-3xl shadow-lg border border-broder-default">
        
        <div className="w-full space-y-8">
          <h1 className="text-font-primary text-2xl font-bold">
            회원가입
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormField
              name="username"
              label="이름"
              control={control}
              error={errors.username?.message}
              render={(field) => (
                <Input
                  id="이름"
                  type="text"
                  placeholder="이름은 영어만 가능합니다."
                  error={errors.username?.message}
                  {...field}
                />
              )}
            />
            
            <FormField
              name="email"
              label="이메일"
              control={control}
              error={errors.email?.message}
              render={(field) => (
                <Input
                  id="이메일"
                  type="email"
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            
            <FormField
              name="password"
              label="비밀번호"
              control={control}
              render={(field) => (
                <Input
                  id="비밀번호"
                  type="password"
                  placeholder="8자리 이상의 비밀번호를 입력하세요"
                  error={errors.password?.message}
                  showPasswordToggle={true}
                  {...field}
                />
              )}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              variant="default"
              className="btn-login bg-blue-500 transition-colors"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? '회원가입 중...' : '회원가입'}</span>
            </Button>
          </form>
          
          <div className="flex justify-center items-center gap-1 pt-4">
            <span className="text-font-primary font-medium">
              이미 계정이 있으신가요?
            </span>
            <button
              type="button"
              className="px-2.5 py-3 text-web-secondary dark:text-web-accent font-bold underline hover:text-web-primary dark:hover:text-web-accent/90 transition-colors"
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
