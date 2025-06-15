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
    const adminToken = await getAdminToken();
    
    await checkUserExists(email, username, adminToken);
    
    const userId = await createKeycloakUser({
      email,
      password,
      username,
      adminToken
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
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