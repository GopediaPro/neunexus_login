import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts";
import { signupSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";

export type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuthContext();

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
        await signup(data);
        navigate('/') 
      } catch (error: any) {
        setError("root", {
          type: "manual",
          message: error.message || "로그인 실패"
        });
      }
    };

  return (
    <div className="w-full h-screen bg-page-bg shadow-xl flex justify-center items-center">
      <div className="w-[590px] p-24 bg-page-card-bg rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border-default">
        
        <div className="w-full space-y-8">
          <h1 className="text-page-font-primary text-2xl font-bold">
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

            {errors.root && (
              <div className="flex items-center pt-1 pl-1 text-sm text-page-error">
                <span className="text-body2">{errors.root.message}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              size="auth"
              loading={isSubmitting}
              className="!mt-[40px]"
            >
              회원가입
            </Button>
          </form>
          
          <div className="flex justify-center items-center gap-1">
            <span className="text-page-font-primary font-medium">
              이미 계정이 있으신가요?
            </span>
            <button
              type="button"
              className="px-2.5 py-3 text-page-button-primary font-bold underline hover:text-page-button-primary-hover transition-colors"
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
