import type { IKeycloakTokenResponse, IKeycloakUser } from "@/types/auth.types";
import { getKeycloakUrls, keycloakConfig } from "@/utils/keycloakConfig";

const tokenCache = new Map<string, { token: string; expires: number }>();

export const tokenService = {
  saveTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    tokenCache.set('access_token', {
      token: accessToken,
      expires: payload.exp * 1000
    });
  },

  getStoredTokens: () => ({
    accessToken: localStorage.getItem('auth_token'),
    refreshToken: localStorage.getItem('refresh_token')
  }),

  isTokenValid: (token: string): boolean => {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },

  getAdminToken: async (): Promise<string> => {
    const cached = tokenCache.get('admin_token');
    
    if (cached && cached.expires > Date.now()) {
      return cached.token;
    }

    const { username, password } = getAdminCredentials();
    const keycloakUrls = getKeycloakUrls();
    
    const response = await fetch(keycloakUrls.token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: keycloakConfig.clientId,
        username,
        password,
      })
    });
    
    if (!response.ok) {
      throw new Error(`Admin 토큰 획득 실패: ${response.status}`);
    }
    
    const tokenData = await response.json();
    const payload = JSON.parse(atob(tokenData.access_token.split('.')[1]));
    
    tokenCache.set('admin_token', {
      token: tokenData.access_token,
      expires: payload.exp * 1000
    });
    
    return tokenData.access_token;
  },

  // 토큰 검증
  verifyToken: async (token: string): Promise<IKeycloakUser | null> => {
    if (!tokenService.isTokenValid(token)) return null;

    try {
      const keycloakUrls = getKeycloakUrls();
      const response = await fetch(keycloakUrls.userInfo, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  },

  // 토큰 갱신
  refreshToken: async (): Promise<IKeycloakTokenResponse | null> => {
    const { refreshToken } = tokenService.getStoredTokens();
    if (!refreshToken || !tokenService.isTokenValid(refreshToken)) return null;

    try {
      const keycloakUrls = getKeycloakUrls();
      const response = await fetch(keycloakUrls.token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: keycloakConfig.clientId,
          refresh_token: refreshToken,
        })
      });

      if (response.ok) {
        const tokenData = await response.json() as IKeycloakTokenResponse;
        tokenService.saveTokens(tokenData.access_token, tokenData.refresh_token);
        return tokenData;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  },

  // 토큰 정리
  clearAuthData: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    tokenCache.clear();
  }
} as const;

// 헬퍼 함수들
const getAdminCredentials = () => ({
  username: import.meta.env.VITE_KEYCLOAK_ADMIN_ID!,
  password: import.meta.env.VITE_KEYCLOAK_ADMIN_PASSWORD!
});