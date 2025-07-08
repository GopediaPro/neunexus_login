import { useAuthContext } from "@/contexts";
import { signupSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";

export type SignupFormData = z.infer<typeof signupSchema>;

export const useSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuthContext();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      username: ""
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = form;

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data);
      navigate('/');
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.message || "회원가입 실패"
      });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    
    handleLoginClick,
  };
};
