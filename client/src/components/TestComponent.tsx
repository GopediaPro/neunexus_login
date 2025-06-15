import { loginSchema } from "@/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { keycloakLogin } from "@/services/keycloakLogin";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export type LoginFormData = z.infer<typeof loginSchema>

const TestComponent = () => { 
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await keycloakLogin(data);

      navigate('/');
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.message || "로그인 실패"
      });
    }
  };

  
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[36.875rem] rounded-lg shadow-lg p-8 border-2">
        <div className="space-y-4">
          <ThemeToggle />

          <img 
            src="/image/logo.svg"
            alt="로고"
            className="w-[15rem] h-[8rem]"
          />

          <div className="flex">
            <h1 className="text-2xl font-semibold">로그인</h1>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)}
            >
              <FormField 
                name="email"
                control={control}
                // 여기 focus 사용위해서 label과 아래 input id 일치 시켜주시면 됨당
                label="이메일"
                render={(field) => (
                  <Input
                    id="이메일"
                    type="email"
                    placeholder="email"
                    {...field}
                  />
                )}
                error={errors.email?.message}
              />
              <FormField 
                name="password"
                control={control}
                label="비밀번호"
                render={(field) => (
                  <Input
                    id="비밀번호"
                    type="password"
                    placeholder="password"
                    error={errors.password?.message}
                    {...field}
                  />
                )}
                error={errors.password?.message}
              />
              <FormField 
                name="password"
                control={control}
                label="비밀번호"
                render={(field) => (
                  <Input
                    id="비밀번호"
                    type="password"
                    placeholder="password"
                    error="error"
                    {...field}
                  />
                )}
                error={errors.password?.message}
              />

              {errors.root && (
                <div>{errors.root.message}</div>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "로그인 중 .." : "로그인"}
              </Button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default TestComponent;