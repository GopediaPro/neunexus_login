import { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

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
      console.log('data', data);

      navigate('/');
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || '로그인 실패'
      });
    }
  };
  useEffect(() => {
    const theme2 = getSystemTheme();
    setTheme(theme2);
    console.log('theme', theme);
  });
  return (
    <div className="w-full h-screen dark:bg-gray-800 bg-slate-50 flex justify-center items-center">
      <div className="w-[590px] p-24 dark:bg-gray-700 bg-white rounded-3xl shadow-lg p-24">
        <div className="flex flex-col items-center gap-10">
          {/* 로고 */}
          <div className="w-64 h-16">
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
          <h1 className="dark:text-white text-neutral-900 text-2xl font-bold">
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
                  className="dark:bg-neutral-700 border-neutral-400 bg-white dark:border-zinc-600 dark:text-zinc-200 text-neutral-600 placeholder:text-zinc-400"
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
                  className="dark:bg-neutral-700 border-neutral-400 bg-white dark:border-zinc-600 dark:text-zinc-200 text-neutral-600 placeholder:text-zinc-400"
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
                        className="w-4 h-4 rounded border border-neutral-900 dark:border-gray-50 bg-transparent accent-blue-500"
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? 1 : 0);
                        }}
                      />
                      <span className="dark:text-gray-50 text-neutral-900 text-sm hover:text-blue-600">
                        자동 로그인
                      </span>
                    </div>
                  )}
                />
              </label>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="py-3 px-2.5 dark:text-gray-50 text-neutral-900 text-sm hover:text-blue-600 transition-colors"
                >
                  아이디 찾기
                </button>
                <div className="w-px h-3.5 bg-zinc-600"></div>
                <button
                  type="button"
                  className="py-3 px-2.5 dark:text-gray-50 text-neutral-900 text-sm hover:text-blue-600 transition-colors"
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
            <span className="text-neutral-800 dark:text-neutral-50 font-medium">
              아직 회원이 아니신가요?
            </span>
            <button
              type="button"
              className="px-2.5 py-3 text-blue-500 font-bold underline hover:text-blue-400 transition-colors"
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
