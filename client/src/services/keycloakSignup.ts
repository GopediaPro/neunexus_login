import { getAdminToken, keycloakLogin } from "@/services/keycloakLogin";
import { createKeycloakUser } from "@/services/keycloakUser";
import type { IAuthResponse, IKeycloakUser, ISignupRequest } from "@/types/auth.types";
import { keycloakConfig } from "@/utils/keycloakConfig";

const checkUserExists = async (email: string, username:string, adminToken: string): Promise<boolean> => {
  const sanitizedUsername = username.replace(/[^\w.-]/g, '_').toLowerCase();
  
  const [emailCheck, usernameCheck] = await Promise.all([
    fetch(`${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users?email=${encodeURIComponent(email)}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }),
    fetch(`${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users?username=${encodeURIComponent(sanitizedUsername)}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    })
  ]);

  const emailUsers = await emailCheck.json();
  const usernameUsers = await usernameCheck.json();

  if (emailUsers.length > 0) {
    throw new Error('이미 존재하는 이메일입니다.');
  }
  if (usernameUsers.length > 0) {
    throw new Error('이미 존재하는 사용자명입니다.');
  }

  return false;
};

export const keycloakSignup = async ({
  email,
  password,
  username
}: ISignupRequest): Promise<IAuthResponse & { user?: IKeycloakUser }> => {
  try {
    // 1. Admin 토큰 획득
    const adminToken = await getAdminToken();
    
    // 2. 중복 사용자 확인
    await checkUserExists(email, username, adminToken);
    
    // 3. Keycloak에 사용자 생성
    const userId = await createKeycloakUser({
      email,
      password,
      username,
      adminToken
    });

    // 4. 사용자 생성 후 잠시 대기 (Keycloak 내부 처리를 위해)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 5. 자동 로그인 시도
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