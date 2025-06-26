import type { IKeycloakTokenResponse, IKeycloakUser } from "@/shared/types/auth.types";
import { getKeycloakUrls, keycloakConfig } from "@/utils/keycloakConfig";

const tokenCache = new Map<string, { token: string; expires: number }>();

export const tokenService = {
  saveTokens: (accessToken: string, refreshToken: string, rememberMe: number): void => {
    const storage = rememberMe === 1 ? localStorage : sessionStorage;
    storage.setItem('auth_token', accessToken);
    storage.setItem('refresh_token', refreshToken);
    storage.setItem('remember_me', String(rememberMe));
    
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    tokenCache.set('access_token', {
      token: accessToken,
      expires: payload.exp * 1000
    });
  },

  getStoredTokens: () => {
    const accessToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    const rememberMe = Number(localStorage.getItem('remember_me') || sessionStorage.getItem('remember_me') || 0);

    return {
      accessToken,
      refreshToken,
      rememberMe
    };
  },

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
    const { refreshToken, rememberMe } = tokenService.getStoredTokens();
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
        tokenService.saveTokens(tokenData.access_token, tokenData.refresh_token, rememberMe);
        return tokenData;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  },

  checkAutoLogin: async (): Promise<{ user: IKeycloakUser; tokens: IKeycloakTokenResponse } | null> => {
    const { accessToken, refreshToken } = tokenService.getStoredTokens();
    
    if (!accessToken && !refreshToken) return null;
    
    // 액세스 토큰이 유효한 경우
    if (accessToken && tokenService.isTokenValid(accessToken)) {
      const userData = await tokenService.verifyToken(accessToken);
      if (userData) {
        return {
          user: userData,
          tokens: { access_token: accessToken, refresh_token: refreshToken || '' } as IKeycloakTokenResponse
        };
      }
    }
    
    if (refreshToken) {
      const newTokens = await tokenService.refreshToken();
      if (newTokens) {
        const userData = await tokenService.verifyToken(newTokens.access_token);
        if (userData) {
          return {
            user: userData,
            tokens: newTokens
          };
        }
      }
    }
    
    tokenService.clearAuthData();
    return null;
  },

  // 토큰 정리
  clearAuthData: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('remember_me');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('remember_me');
    tokenCache.clear();
  }
} as const;

// 헬퍼 함수들
const getAdminCredentials = () => ({
  username: import.meta.env.VITE_KEYCLOAK_ADMIN_ID!,
  password: import.meta.env.VITE_KEYCLOAK_ADMIN_PASSWORD!
});