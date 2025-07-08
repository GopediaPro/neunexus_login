import { useAuthContext } from "@/contexts";
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: 0
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = form;

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/');
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || '로그인 실패'
      });
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    handleSignupClick,
  };
}