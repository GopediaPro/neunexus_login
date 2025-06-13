// hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import { useApi } from './useApi';

// Keycloak 설정
const keycloakConfig = {
  url: 'http://localhost:8080/auth',
  realm: 'your-realm',
  clientId: 'your-client-id'
};

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const api = useApi();

  useEffect(() => {
    // 앱 시작 시 토큰 확인
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const userData = await verifyToken(token);

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // 토큰이 유효하지 않으면 토큰 갱신 시도
          await attemptTokenRefresh();
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  // Keycloak 토큰 검증
  const verifyToken = async (token: string) => {
    try {
      const url = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid_connect/userinfo`;

      const response = await api.get(url, api.withAuth(token));

      if (response.data && !response.error) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  };

  // 토큰 갱신
  const attemptTokenRefresh = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        clearAuthData();
        return;
      }

      const url = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid_connect/token`;

      // URLSearchParams 형태로 데이터 전송 (application/x-www-form-urlencoded)
      const formData = new URLSearchParams({
        client_id: keycloakConfig.clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      });

      const response = await api.apiCall(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (response.data && !response.error) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);

        // 새 토큰으로 사용자 정보 다시 가져오기
        const userData = await verifyToken(response.data.access_token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
    }
  };

  // 인증 데이터 정리
  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const url = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid_connect/token`;

      // URLSearchParams 형태로 데이터 전송 (application/x-www-form-urlencoded)
      const formData = new URLSearchParams({
        client_id: keycloakConfig.clientId,
        grant_type: 'password',
        username: email,
        password: password
      });

      const response = await api.apiCall(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (response.data && !response.error) {
        const { access_token, refresh_token } = response.data;

        // 토큰 저장
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // 사용자 정보 가져오기
        const userData = await verifyToken(access_token);

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);

          // PostgreSQL에 사용자 정보 동기화
          await syncUserToDatabase(userData);
        } else {
          throw new Error('Failed to get user info');
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 회원가입
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      const response = await api.post('/api/auth/register', {
        email,
        password,
        name
      });

      if (response.data && !response.error) {
        // 등록 후 자동 로그인
        await login(email, password);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // PostgreSQL에 사용자 정보 동기화
  const syncUserToDatabase = async (userData: any) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) return;

      const response = await api.post(
        '/api/users/sync',
        userData,
        api.withAuth(token)
      );

      if (response.error) {
        console.error('User sync failed:', response.error);
      }
    } catch (error) {
      console.error('User sync failed:', error);
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (token && refreshToken) {
        // Keycloak 서버에서 로그아웃
        const url = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid_connect/logout`;

        // URLSearchParams 형태로 데이터 전송
        const formData = new URLSearchParams({
          client_id: keycloakConfig.clientId,
          refresh_token: refreshToken
        });

        const response = await api.apiCall(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (response.error) {
          console.error('Server logout failed:', response.error);
        }
      }
    } catch (error) {
      console.error('Logout from server failed:', error);
    } finally {
      // 로컬 데이터는 항상 정리
      clearAuthData();
    }
  };

  // 토큰 수동 갱신
  const refreshUserToken = async () => {
    try {
      await attemptTokenRefresh();
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      clearAuthData();
    }
  };

  return {
    user,
    login,
    register,
    logout,
    refreshUserToken,
    isAuthenticated,
    loading: loading
  };
};
