import type { IKeycloakConfig, IKeycloakUrls } from "@/shared/types/auth.types";

export const keycloakConfig: IKeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
}

// keycloak api url
export const getKeycloakUrls = (): IKeycloakUrls => {
  const baseUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect`;
  
  return {
    userInfo: `${baseUrl}/userinfo`,
    token: `${baseUrl}/token`,
    logout: `${baseUrl}/logout`
  };
};

// admin 정보
export const getAdminCredentials = () => ({
  username: import.meta.env.VITE_KEYCLOAK_ADMIN_ID,
  password: import.meta.env.VITE_KEYCLOAK_ADMIN_PASSWORD
});

// api 관련 설정
export const getApiConfig = () => ({
  syncEnabled: import.meta.env.VITE_SYNC_ENABLED === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL
});