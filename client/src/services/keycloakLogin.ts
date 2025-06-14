import type { IKeycloakTokenResponse, IKeycloakUser, ILoginRequest } from "@/types/auth.types";
import { getAdminCredentials, getKeycloakUrls, keycloakConfig } from "@/utils/keycloakConfig";

const keycloakUrls = getKeycloakUrls();

export const getAdminToken = async (): Promise<string> => {
  try {
    const { username, password } = getAdminCredentials();
    
    const response = await fetch(keycloakUrls.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: keycloakConfig.clientId,
        username,
        password,
      })
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Admin 로그인 실패:', responseText);
      throw new Error(`Admin 토큰 획득 실패: Status ${response.status} - ${responseText}`);
    }
    
    const tokenData = JSON.parse(responseText);
    return tokenData.access_token;
  } catch (error) {
    console.error('Admin 토큰에러:', error);
    throw error;
  }
};

export const checkEmailExists = async (email: string, adminToken: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users?email=${encodeURIComponent(email)}`,
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`, 
          'Content-Type': 'application/json' 
        }
      }
    );

    if (!response.ok) {
      console.error('이메일 검색 실패:', response.status);
      return false;
    }

    const users = await response.json();
    return users.length > 0;
  } catch (error) {
    console.error('이메일 확인 에러:', error);
    return false;
  }
};

export const verifyToken = async (token: string): Promise<IKeycloakUser | null> => {
  try {
    const response = await fetch(keycloakUrls.userInfo, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const userData = await response.json();
      return userData as IKeycloakUser;
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('auth_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const keycloakLogin = async ({ email, password }: ILoginRequest): Promise<{
  user: IKeycloakUser;
  tokens: IKeycloakTokenResponse;
}> => {
  try {
    // 1. Admin 토큰으로 이메일 존재 여부 확인
    const adminToken = await getAdminToken();
    const emailExists = await checkEmailExists(email, adminToken);

    if (!emailExists) {
      throw new Error('존재하지 않는 이메일입니다.');
    }

    // 2. 사용자 로그인 시도
    const response = await fetch(keycloakUrls.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: keycloakConfig.clientId,
        grant_type: 'password',
        username: email,
        password: password,
        scope: 'openid profile'
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('로그인 실패:', responseText);
      throw new Error(`로그인 실패: Status ${response.status} - ${responseText}`);
    }

    const tokenData = JSON.parse(responseText) as IKeycloakTokenResponse;

    // 3. 토큰 저장
    saveTokens(tokenData.access_token, tokenData.refresh_token);

    // 4. 사용자 정보 획득
    const userData = await verifyToken(tokenData.access_token);

    if (!userData) {
      throw new Error('Failed to get user info');
    }

    return {
      user: userData,
      tokens: tokenData
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};