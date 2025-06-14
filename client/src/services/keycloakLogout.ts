import { getKeycloakUrls, keycloakConfig } from "@/utils/keycloakConfig";

const keycloakUrls = getKeycloakUrls();

export const getStoredTokens = () => ({
  accessToken: localStorage.getItem('auth_token'),
  refreshToken: localStorage.getItem('refresh_token')
});

export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
};

export const keycloakLogout = async (): Promise<void> => {
  try {
    const { accessToken, refreshToken } = getStoredTokens();

    // Keycloak 서버에서 로그아웃 시도
    if (accessToken && refreshToken) {
      const response = await fetch(keycloakUrls.logout, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${accessToken}`
        },
        body: new URLSearchParams({
          client_id: keycloakConfig.clientId,
          refresh_token: refreshToken
        })
      });

      if (!response.ok) {
        console.error('서버 로그아웃 실패:', response.status);
      }
    }
  } catch (error) {
    console.error('서버로부터 로그아웃 실패:', error);
  } finally {
    clearAuthData();
  }
};