import { tokenService } from "@/services/keycloakToken";
import { checkEmailExists } from "@/services/keycloakUser";
import type { IKeycloakTokenResponse, IKeycloakUser, ILoginRequest } from "@/share/types/auth.types";
import { getKeycloakUrls, keycloakConfig } from "@/utils/keycloakConfig";

const keycloakUrls = getKeycloakUrls();


export const keycloakLogin = async ({ email, password, rememberMe = 0 }: ILoginRequest): Promise<{
  user: IKeycloakUser;
  tokens: IKeycloakTokenResponse;
}> => {
  try {
    // 1. Admin 토큰으로 이메일 존재 여부 확인
    const adminToken = await tokenService.getAdminToken();
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
    tokenService.saveTokens(tokenData.access_token, tokenData.refresh_token, rememberMe);

    // 4. 사용자 정보 획득
    const userData = await tokenService.verifyToken(tokenData.access_token);

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