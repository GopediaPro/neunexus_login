import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks";
import { loginSchema } from "@/schemas/auth.schema";
import type { IUser } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

export type LoginFormData = z.infer<typeof loginSchema>

const TestComponent = () => { 
  const { user, login, logout, isAuthenticated, loading } = useAuth();

  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: IUser) => {
    console.log(data);

    try {
      await login(data.email, data.password);
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.message || "로그인 실패"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center">
      <ThemeToggle />
      <div className="w-[36.875rem] rounded-lg shadow-lg p-8 border-2">
        <div className="space-y-4">

          <img 
            src="/image/logo.png"
            alt="로고"
            className="w-[15rem] h-[8rem]"
          />

          <div className="flex">
            <h1 className="text-2xl font-semibold">로그인</h1>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5">
              <div>
                <FormField 
                  name="email"
                  control={control}
                  // 여기 focus 사용위해서 label과 아래 input id 일치 시켜주시면 됨당
                  label="email"
                  render={(field) => (
                    <Input
                      id="email"
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
                  label="password"
                  render={(field) => (
                    <Input
                      id="password"
                      type="password"
                      placeholder="password"
                      {...field}
                    />
                  )}
                  error={errors.email?.message}
                />

                {errors.root && (
                  <div>{errors.root.message}</div>
                )}

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "로그인 중 .." : "로그인"}
                </Button>
              </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default TestComponent;