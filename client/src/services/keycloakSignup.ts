import { keycloakLogin } from "@/services/keycloakLogin";
import { tokenService } from "@/services/keycloakToken";
import { checkUserExists, createKeycloakUser } from "@/services/keycloakUser";
import type { IAuthResponse, IKeycloakUser, ISignupRequest } from "@/shared/types/auth.types";

export const keycloakSignup = async ({
  email,
  password,
  username
}: ISignupRequest): Promise<IAuthResponse & { user?: IKeycloakUser }> => {
  try {
    const adminToken = await tokenService.getAdminToken();
    
    await checkUserExists(email, username, adminToken);
    await createKeycloakUser({
      email,
      password,
      username,
      adminToken
    });

    const KEYCLOAK_USER_CREATION_DELAY = 2000;

    await new Promise(resolve => setTimeout(resolve, KEYCLOAK_USER_CREATION_DELAY));
    
    try {
      const loginResult = await keycloakLogin({ email, password });
      
      return {
        success: true,
        message: '회원가입 및 로그인이 완료되었습니다.',
        autoLogin: true,
        user: loginResult.user
      };
    } catch (loginError) {
      console.warn('자동 로그인 실패, 수동 로그인 필요:', loginError);
      
      return {
        success: true,
        message: '회원가입이 완료되었습니다. 로그인해주세요.',
        autoLogin: false
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};