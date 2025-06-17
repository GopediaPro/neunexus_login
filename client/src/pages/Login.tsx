import { Input } from '@/components/ui/input';
import { signupSchema } from '@/schemas/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { keycloakSignup } from '@/services/keycloakSignup';
import { Checkbox } from '@/components/ui/Checkbox';

export type SignupFormData = z.infer<typeof signupSchema>;

const Login = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      username: 'aasd'
    }
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
    } catch (error: any) {}
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[36.875rem] rounded-lg shadow-lg p-8 border-2">
        <div className="space-y-4">
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
            className="flex flex-col gap-6"
          >
            <FormField
              name="id"
              control={control}
              // 여기 focus 사용위해서 label과 아래 input id 일치 시켜주시면 됨당
              label="아이디"
              render={(field, fieldId) => (
                <Input
                  id={fieldId}
                  type="email"
                  placeholder="아이디"
                  {...field}
                />
              )}
              error={errors.email?.message}
            />
            <FormField
              name="password"
              control={control}
              label="비밀번호"
              render={(field, fieldId) => (
                <Input
                  id={fieldId}
                  type="password"
                  placeholder="비밀번호"
                  {...field}
                />
              )}
              error={errors.password?.message}
            />

            {errors.root && <div>{errors.root.message}</div>}
            <Checkbox />
            <label>자동 로그인</label>
            <label>아이디 찾기</label>
            <label>비밀번호 찾기</label>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 스피닝' : '로그인'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
