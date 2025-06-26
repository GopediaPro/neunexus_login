import { checkEmailExists, checkUserExists, createKeycloakUser } from "@/services/keycloakUser";
import type { IKeycloakTokenResponse, IKeycloakUser, ILoginRequest, ISignupRequest } from "@/share/types/auth.types";
import { getKeycloakUrls, keycloakConfig } from "@/utils/keycloakConfig";
import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

interface AuthContextType {
  user: IKeycloakUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: ILoginRequest) => Promise<void>;
  logout: () => void;
  signup: ({ email, password, username }: ISignupRequest) => void;
  refreshToken: () => Promise<void>;
}

interface AuthState {
  user: IKeycloakUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface SetLoadingAction {
  type: 'SET_LOADING';
  payload: boolean;
}

interface LoginSuccessAction {
  type: 'LOGIN_SUCCESS';
  payload: IKeycloakUser;
}

interface LogoutAction {
  type: 'LOGOUT';
}

interface TokenRefreshSuccessAction {
  type: 'TOKEN_REFRESH_SUCCESS';
  payload: IKeycloakUser;
}

type AuthAction = SetLoadingAction | LoginSuccessAction | LogoutAction | TokenRefreshSuccessAction;

// Action Creators
const authActions = {
  setLoading: (payload: boolean): SetLoadingAction => ({
    type: 'SET_LOADING',
    payload
  }),
  loginSuccess: (payload: IKeycloakUser): LoginSuccessAction => ({
    type: 'LOGIN_SUCCESS',
    payload
  }),
  logout: (): LogoutAction => ({
    type: 'LOGOUT'
  }),
  tokenRefreshSuccess: (payload: IKeycloakUser): TokenRefreshSuccessAction => ({
    type: 'TOKEN_REFRESH_SUCCESS',
    payload
  })
} as const;

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { 
        ...state, 
        loading: action.payload 
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'TOKEN_REFRESH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true
};

const tokenCache = new Map<string, { token: string; expires: number }>();

export const tokenUtils = {
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

    return { accessToken, refreshToken, rememberMe };
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

export const apiUtils = {
  getAdminToken: async () => {
    const cached = tokenCache.get('admin_token');
    
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
    
    tokenCache.set('admin_token', {
      token: tokenData.access_token,
      expires: payload.exp * 1000
    });
    
    return tokenData.access_token;
  },

  verifyToken: async (token: string): Promise<IKeycloakUser | null> => {
    if (!tokenUtils.isTokenValid(token)) return null;

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
    const { refreshToken, rememberMe } = tokenUtils.getStoredTokens();
    
    if (!refreshToken || !tokenUtils.isTokenValid(refreshToken)) {
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
      tokenUtils.saveTokens(tokenData.access_token, tokenData.refresh_token, rememberMe);
      return tokenData;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }
} as const;

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const keycloakUrls = getKeycloakUrls();

  useEffect(() => {
    initializeAuth();
  }, []);

  const attemptTokenRefresh = async () => {
    try {
      const tokenData = await apiUtils.refreshTokens();
      
      if (!tokenData) {
        tokenUtils.clearAuthData();
        dispatch(authActions.logout());
        return false;
      }
      
      const userData = await apiUtils.verifyToken(tokenData.access_token);
      if (userData) {
        dispatch(authActions.tokenRefreshSuccess(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      tokenUtils.clearAuthData();
      dispatch(authActions.logout());
      return false;
    }
  };

  const initializeAuth = async () => {
    try {
      const { accessToken, refreshToken } = tokenUtils.getStoredTokens();
      
      if (!accessToken && !refreshToken) {
        dispatch(authActions.setLoading(false));
        return;
      }
      
      if (accessToken && tokenUtils.isTokenValid(accessToken)) {
        const userData = await apiUtils.verifyToken(accessToken);
        if (userData) {
          dispatch(authActions.loginSuccess(userData));
          return;
        }
      }
      
      if (refreshToken) {
        const success = await attemptTokenRefresh();
        if (!success) {
          tokenUtils.clearAuthData();
          dispatch(authActions.logout());
        }
      } else {
        tokenUtils.clearAuthData();
        dispatch(authActions.logout());
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      tokenUtils.clearAuthData();
      dispatch(authActions.logout());
    } finally {
      dispatch(authActions.setLoading(false));
    }
  };

  const login = async ({ email, password, rememberMe = 0 }: ILoginRequest): Promise<void> => {
    try {
      const adminToken = await apiUtils.getAdminToken();
      const emailExists = await checkEmailExists(email, adminToken);

      if (!emailExists) {
        throw new Error('존재하지 않는 이메일입니다.');
      }

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
      tokenUtils.saveTokens(tokenData.access_token, tokenData.refresh_token, rememberMe);

      const userData = await apiUtils.verifyToken(tokenData.access_token);

      if (!userData) {
        throw new Error('Failed to get user info');
      }

      dispatch(authActions.loginSuccess(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { accessToken, refreshToken } = tokenUtils.getStoredTokens();

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
      // 항상 클라이언트 토큰 정리 및 상태 업데이트
      tokenUtils.clearAuthData();
      dispatch(authActions.logout());
    }
  }

  const signup = async ({ email, password, username }: ISignupRequest) => {
    try {
      const adminToken = await apiUtils.getAdminToken();
      
      await checkUserExists(email, username, adminToken);
      await createKeycloakUser({
        email,
        password,
        username,
        adminToken
      });

      const KEYCLOAK_USER_CREATION_DELAY = 2000;
      await new Promise(resolve => setTimeout(resolve, KEYCLOAK_USER_CREATION_DELAY));
      
      try {
        // AuthContext의 login 메서드 사용
        await login({ email, password });
        
        return {
          success: true,
          message: '회원가입 및 로그인이 완료되었습니다.',
          autoLogin: true,
          user: state.user
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

  const refreshTokenManually = async () => {
    try {
      await attemptTokenRefresh();
    } catch (error) {
      console.error('리프레시 토큰 실패:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    login,
    logout,
    signup,
    refreshToken: refreshTokenManually
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};