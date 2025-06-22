import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이여야 합니다."),
  rememberMe: z.number().min(0).max(1)
});

export const signupSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이여야 합니다."),
  username: z
    .string()
    .min(2, "이름은 최소 2자 이상이여야 합니다.")
    .regex(/^[A-Za-z0-9._-]+$/, "이름에는 영문자만 사용할 수 있습니다.")
})