import type { IKeycloakTokenResponse, IKeycloakUser } from '@/share/types/auth.types';
import { getKeycloakUrls, keycloakConfig } from '@/utils/keycloakConfig';
import { tokenManager } from './tokenManager';

export const authApi = {
  getAdminToken: async (): Promise<string> => {
    const cached = tokenManager.getTokenCache('admin_token');
    
    if (cached && cached.expires > Date.now()) {
      return cached.token;
    }

    const keycloakUrls = getKeycloakUrls();
    const response = await fetch(keycloakUrls.token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: keycloakConfig.clientId,
        username: import.meta.env.VITE_KEYCLOAK_ADMIN_ID!,
        password: import.meta.env.VITE_KEYCLOAK_ADMIN_PASSWORD!,
      })
    });
    
    if (!response.ok) {
      throw new Error(`Admin 토큰 획득 실패: ${response.status}`);
    }
    
    const tokenData = await response.json();
    const payload = JSON.parse(atob(tokenData.access_token.split('.')[1]));
    
    tokenManager.setTokenCache('admin_token', tokenData.access_token, payload.exp * 1000);
    
    return tokenData.access_token;
  },

  verifyToken: async (token: string): Promise<IKeycloakUser | null> => {
    if (!tokenManager.isTokenValid(token)) return null;

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

  refreshTokens: async (): Promise<IKeycloakTokenResponse | null> => {
    const { refreshToken, rememberMe } = tokenManager.getStoredTokens();
    
    if (!refreshToken || !tokenManager.isTokenValid(refreshToken)) {
      return null;
    }

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

      if (!response.ok) return null;

      const tokenData = await response.json() as IKeycloakTokenResponse;
      
      tokenManager.saveTokens(tokenData.access_token, tokenData.refresh_token, rememberMe);
      
      return tokenData;
    } catch (error) {
      console.error('리프레시 토큰 실패:', error);
      return null;
    }
  }
} as const;