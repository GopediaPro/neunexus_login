import { loginSchema } from '@/schemas/auth.schema';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/FormField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { keycloakLogin } from '@/services/keycloakLogin';
import { Checkbox } from '@/components/ui/Checkbox';
import { useTheme } from 'next-themes';

export type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: 0
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await keycloakLogin(data);

      navigate('/');
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || '로그인 실패'
      });
    }
  };

  return (
    <div className="w-full h-screen bg-web-background flex justify-center items-center">
      <div className="w-[590px] px-24 py-14 bg-card rounded-3xl shadow-lg border border-broder-default">
        <div className="flex flex-col items-center gap-10">
          {/* 로고 */}
          <div className="w-64 h-16 mb-20">
            {theme == 'dark' ? (
              <img
                src="/image/logo-dark.svg"
                alt="로고"
                className="w-[15rem] h-[8rem]"
              />
            ) : (
              <img
                src="/image/logo.svg"
                alt="로고"
                className="w-[15rem] h-[8rem]"
              />
            )}
          </div>
        </div>
        {/* 로그인 폼 */}
        <div className="w-full space-y-4">
          <h1 className="text-font-primary text-2xl font-bold">
            로그인
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="email"
              control={control}
              error={errors.email?.message}
              render={(field) => (
                <Input
                  id="이메일"
                  type="email"
                  placeholder="email"
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />
            <FormField
              name="password"
              control={control}
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
            {/* 자동로그인 & 찾기 옵션 */}
            <div className="flex justify-between items-center">
              <label>
                <FormField
                  name="rememberMe"
                  control={control}
                  render={(field) => (
                    <div className="flex items-center gap-2 py-3 cursor-pointer">
                      <Checkbox
                        checked={field.value === 1}
                        className="w-4 h-4 rounded border border-border-default bg-transparent"
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? 1 : 0);
                        }}
                      />
                      <span className="text-font-secondary text-sm hover:text-web-primary transition-colors">
                        자동 로그인
                      </span>
                    </div>
                  )}
                />
              </label>

              <div className="flex items-center">
                <button
                  type="button"
                  className="py-3 px-2.5 text-font-secondary text-sm hover:text-web-primary transition-colors"
                >
                  아이디 찾기
                </button>
                <div className="w-px h-3.5 bg-border-default"></div>
                <button
                  type="button"
                  className="py-3 px-2.5 text-font-secondary text-sm hover:text-web-primary transition-colors"
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              className="btn-login bg-blue-500 transition-colors"
              disabled={isSubmitting}
            >
              <span>로그인</span>
            </Button>
          </form>
          {/* 회원가입 링크 */}
          <div className="flex justify-center items-center gap-1 pt-4">
            <span className="text-font-primary font-medium">
              아직 회원이 아니신가요?
            </span>
            <button
              type="button"
              className="px-2.5 py-3 text-web-secondary dark:text-web-accent font-bold underline hover:text-web-primary dark:hover:text-web-accent/90 transition-colors"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
