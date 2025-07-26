import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/hooks";

export const SignupPage = () => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    handleLoginClick
  } = useSignup();

  return (
    <div className="w-full h-screen bg-fill-base-200 shadow-xl flex justify-center items-center">
      <div className="w-[590px] p-24 rounded-3xl bg-fill-base-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-stroke-base-100">
        <div className="w-full space-y-8">
          <h1 className="text-text-base-500 text-h2">
            회원가입
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
              <div className="flex items-center pt-1 pl-1 text-sm text-error-500">
                <span className="text-caption">{errors.root.message}</span>
              </div>
            )}
            <Button
              type="submit"
              variant="default"
              size="auth"
              loading={isSubmitting}
              className="!mt-[40px] !text-text-contrast-500"
            >
              회원가입
            </Button>
          </form>
          
          <div className="flex justify-center items-center gap-1">
            <span className="text-text-base-500 text-body-s">
              이미 계정이 있으신가요?
            </span>
            <button
              type="button"
              className="px-2.5 py-3 text-primary-500 text-body-s underline hover:text-primary-700 transition-colors"
              onClick={handleLoginClick}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
