import { authApi } from "@/contexts/auth/authApi";
import { authActions, authReducer, initialState } from "@/contexts/auth/authState";
import { tokenManager } from "@/contexts/auth/tokenManager";
import { userApi } from "@/contexts/auth/userApi";
import type { IAuthResponse, IKeycloakUser, ILoginRequest, ISignupRequest } from "@/share/types/auth.types";
import { getKeycloakUrls, keycloakConfig } from "@/utils/keycloakConfig";
import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

interface AuthContextType {
  user: IKeycloakUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: ILoginRequest) => Promise<void>;
  signup: (data: ISignupRequest) => Promise<IAuthResponse & { user?: IKeycloakUser }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    throw new Error('AuthProvider not found');
  },
  signup: async () => {
    throw new Error('AuthProvider not found');
  },
  logout: async () => {
    throw new Error('AuthProvider not found');
  },
  refreshToken: async () => {
    throw new Error('AuthProvider not found');
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const keycloakUrls = getKeycloakUrls();

  useEffect(() => {
    initializeAuth();
  }, []);

  const attemptTokenRefresh = async (): Promise<boolean> => {
    try {
      const tokenData = await authApi.refreshTokens();
      
      if (!tokenData) {
        tokenManager.clearAuthData();
        dispatch(authActions.logout());
        return false;
      }
      
      const userData = await authApi.verifyToken(tokenData.access_token);
      if (userData) {
        dispatch(authActions.tokenRefreshSuccess(userData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('리프레시 토큰 실패:', error);
      tokenManager.clearAuthData();
      dispatch(authActions.logout());
      return false;
    }
  };

  const initializeAuth = async () => {
    try {
      const { accessToken, refreshToken } = tokenManager.getStoredTokens();
      
      if (!accessToken && !refreshToken) {
        dispatch(authActions.setLoading(false));
        return;
      }
      
      if (accessToken && tokenManager.isTokenValid(accessToken)) {
        const userData = await authApi.verifyToken(accessToken);
        if (userData) {
          dispatch(authActions.loginSuccess(userData));
          return;
        }
      }
      
      if (refreshToken) {
        const success = await attemptTokenRefresh();
        if (!success) {
          tokenManager.clearAuthData();
          dispatch(authActions.logout());
        }
      } else {
        tokenManager.clearAuthData();
        dispatch(authActions.logout());
      }
    } catch (error) {
      console.error('로그인 인증 실패:', error);
      tokenManager.clearAuthData();
      dispatch(authActions.logout());
    } finally {
      dispatch(authActions.setLoading(false));
    }
  };

  const login = async ({ email, password, rememberMe = 0 }: ILoginRequest): Promise<void> => {
    try {
      const adminToken = await authApi.getAdminToken();
      const emailExists = await userApi.checkEmailExists(email, adminToken);

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

      const tokenData = JSON.parse(responseText);
      tokenManager.saveTokens(tokenData.access_token, tokenData.refresh_token, rememberMe);

      const userData = await authApi.verifyToken(tokenData.access_token);

      if (!userData) {
        throw new Error('Failed to get user info');
      }

      dispatch(authActions.loginSuccess(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async ({ email, password, username }: ISignupRequest): Promise<IAuthResponse & { user?: IKeycloakUser }> => {
    try {
      const adminToken = await authApi.getAdminToken();
      
      await userApi.checkUserExists(email, username, adminToken);
      await userApi.createKeycloakUser({
        email,
        password,
        username,
        adminToken
      });

      const KEYCLOAK_USER_CREATION_DELAY = 2000;
      await new Promise(resolve => setTimeout(resolve, KEYCLOAK_USER_CREATION_DELAY));
      
      try {
        await login({ email, password });
        
        return {
          success: true,
          message: '회원가입 및 로그인이 완료되었습니다.',
          autoLogin: true,
          user: state.user ?? undefined
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

  const logout = async (): Promise<void> => {
    try {
      const { accessToken, refreshToken } = tokenManager.getStoredTokens();

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
      tokenManager.clearAuthData();
      dispatch(authActions.logout());
    }
  };

  const refreshTokenManually = async (): Promise<void> => {
    try {
      await attemptTokenRefresh();
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.loading,
    login,
    signup,
    logout,
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