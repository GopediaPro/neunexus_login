export interface IKeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

export interface IKeycloakUrls {
  userInfo: string;
  token: string;
  logout: string;
}

export interface IKeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
  scope: string;
}

export interface IKeycloakUser {
  sub: string;
  email: string;
  preferred_username: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  [key: string]: any; // 나중에 keycloak 속성들 추가시킬때 넣어주세요
}

export interface ILoginRequest {
  email: string;
  password: string;
  rememberMe?: number;
}

export interface ISignupRequest {
  email: string;
  password: string;
  username: string;
}

export interface ICreateUserRequest {
  email: string;
  password: string;
  username: string;
  adminToken: string;
}

export interface IUserCredential {
  type: string;
  value: string;
  temporary: boolean;
  createdDate?: number;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  autoLogin?: boolean;
}

// T 타입 추후 설정 해야됨 useApi에서도 같이 수정
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
}

export interface AuthError extends Error {
  code?: string;
  status?: number;
}
