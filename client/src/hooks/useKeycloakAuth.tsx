import { useApi } from '@/hooks/useApi';
import { getKeycloakUrls, keycloakConfig } from '@/utils/keycloakConfig';
import { useState, useEffect } from 'react';

export const useKeycloakAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const keycloakUrls = getKeycloakUrls();

  useEffect(() => {
    // 앱 시작 시 토큰 확인
    initializeAuth();
  }, []);

  const api = useApi();

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        // 토근 만료되면 갱신
        if (isTokenExpired(token)) {
          await attemptTokenRefresh();
          return;
        }

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

  // 토큰 만료 확인
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Keycloak 토큰 검증
  const verifyToken = async (token: string) => {
    try {
      const response = await api.get(keycloakUrls.userInfo, api.withAuth(token));

      if (response.data && !response.error) {
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Token verification failed:', error);

      if (error.message?.includes('CORS') || error.message?.includes('net::ERR_FAILED')) {
        console.warn('🚫 CORS 에러 - 개발 환경 설정 필요');
        // 개발 환경에서는 토큰을 유지하고 사용자 정보만 null 반환
        return null;
      }
      
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
  
      const response = await fetch(keycloakUrls.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: keycloakConfig.clientId,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });
  
      if (!response.ok) {
        clearAuthData();
        return;
      }
  
      const tokenData = await response.json();
      localStorage.setItem('auth_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
  
      // 새 토큰으로 사용자 정보 다시 가져오기
      const userData = await verifyToken(tokenData.access_token);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('리프레시 토큰 에러:', error);
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

  // PostgreSQL에 사용자 정보 동기화
  // const syncUserToDatabase = async (userData: any) => {
  //   const syncEnabled = import.meta.env.VITE_SYNC_ENABLED === 'true';
  //   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  //   if (!syncEnabled) {
  //     return;
  //   }

  //   if (!apiBaseUrl || apiBaseUrl.includes('5173')) {
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem('auth_token');

  //     if (!token) return;

  //     const response = await api.post(
  //       '/api/users/sync',
  //       userData,
  //       api.withAuth(token)
  //     );

  //     if (response.error) {
  //       console.error('User sync failed:', response.error);
  //     }
  //   } catch (error) {
  //     console.error('User sync failed:', error);
  //   }
  // };

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
    refreshUserToken,
    isAuthenticated,
    loading: loading
  };
};
