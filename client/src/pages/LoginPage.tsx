import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Logo } from '@/components/ui/Logo';
import { useLogin } from '@/hooks';

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    handleSignupClick
  } = useLogin();

  return (
    <div className="w-full h-screen bg-page-bg shadow-xl flex justify-center items-center">
      <div className="w-[590px] px-24 py-14 bg-page-card-bg rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border-default">
        <div className="flex flex-col items-center">
          <div className="w-64 h-16 mb-20">
            <Logo className='w-[15rem] h-[8rem]' />
          </div>
        </div>
        
        <div className="w-full space-y-4">
          <h1 className="text-page-font-primary text-h2">
            로그인
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              name="email"
              control={control}
              error={errors.email?.message}
              render={(field) => (
                <Input
                  id="이메일"
                  type="email"
                  placeholder="아이디"
                  error={errors.email?.message}
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
                  placeholder="비밀번호"
                  error={errors.password?.message}
                  {...field}
                />
              )}
              error={errors.password?.message}
            />

            {errors.root && (
              <div className="flex items-center pt-1 pl-1 text-sm text-page-error">
                <span className="text-caption">아이디 패스워드가 일치하지 않습니다.</span>
              </div>
            )}

            <div className="flex justify-between items-center !mt-[0px]">
              <label>
                <FormField
                  name="rememberMe"
                  control={control}
                  render={(field) => (
                    <div className="flex items-center gap-2 py-3 cursor-pointer">
                      <Checkbox
                        checked={field.value === 1}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? 1 : 0);
                        }}
                      />
                      <span className="text-page-font-secondary text-body-s transition-colors">
                        자동 로그인
                      </span>
                    </div>
                  )}
                />
              </label>

              <div className="flex items-center mt-2">
                <button
                  type="button"
                  className="py-3 px-2.5 text-page-font-secondary text-body-s transition-colors"
                >
                  아이디 찾기
                </button>
                <div className="w-px h-3.5 bg-border-default"></div>
                <button
                  type="button"
                  className="py-3 px-2.5 text-page-font-secondary text-body-s transition-colors"
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              size="auth"
              loading={isSubmitting}
              className="!mt-[10px]"
              disabled={isSubmitting}          
            >
              <span>로그인</span>
            </Button>
          </form>
        
          <div className="flex justify-center items-center gap-1">
            <span className="text-page-font-primary text-body-s">
              아직 회원이 아니신가요?
            </span>
            <button
              type="button"
              className="px-2.5 py-3 text-page-button-primary text-body-s underline hover:text-page-button-primary-hover transition-colors"
              onClick={handleSignupClick}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
