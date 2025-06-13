import { useState, useEffect } from 'react';
import { useApi } from './useApi';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
};

const getKeycloakUrls = () => {
  const baseUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect`;
  
  return {
    userInfo: `${baseUrl}/userinfo`,
    token: `${baseUrl}/token`,
    logout: `${baseUrl}/logout`
  };
};

export const useAuthWithKeycloak = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const api = useApi();
  const keycloakUrls = getKeycloakUrls();

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
      const response = await api.get(keycloakUrls.userInfo, api.withAuth(token));

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

  // Admin API 사용할 예정
  const getAdminToken = async (): Promise<string> => {
    try {
      const response = await fetch(keycloakUrls.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: keycloakConfig.clientId,
          username: import.meta.env.VITE_KEYCLOAK_ADMIN_ID,
          password: import.meta.env.VITE_KEYCLOAK_ADMIN_PASSWORD,
        })
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error('Admin 로그인 실패:', responseText);
        throw new Error(`Admin 토큰 획득 실패: Status ${response.status} - ${responseText}`);
      }
      
      const tokenData = JSON.parse(responseText);
      
      return tokenData.access_token;
    } catch (error) {
      console.error('Admin 토큰에러:', error);
      throw error;
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const adminToken = await getAdminToken();
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
  
      const tokenData = JSON.parse(responseText);
      const { access_token, refresh_token } = tokenData;
  
      // 토큰 저장
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
  
      // 사용자 정보 가져오기
      const userData = await verifyToken(access_token);
  
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
  
        // PostgreSQL에 사용자 정보 동기화
        try {
          await syncUserToDatabase(userData);
        } catch (syncError) {
          console.warn('📊 User sync failed but login successful:', syncError);
          // 동기화 실패는 무시하고 로그인 성공 처리
        }
        
      } else {
        throw new Error('Failed to get user info');
      }
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 로그인 
  const checkEmailExists = async (email: string, adminToken: string): Promise<boolean> => {
    try {
      const response = await fetch(`${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users?email=${encodeURIComponent(email)}`, {
        headers: { 
          'Authorization': `Bearer ${adminToken}`, 
          'Content-Type': 'application/json' 
        }
      });

      if (!response.ok) {
        console.error('이메일 검색 실패:', response.status);
        return false;
      }

      const users = await response.json();
      const exists = users.length > 0;
      
      return exists;
    } catch (error) {
      console.error('이메일 확인 에러:', error);
      return false;
    }
  };

// 회원가입 사용자 확인
  const checkUserExists = async (email: string, username:string, adminToken: string): Promise<boolean> => {
  const sanitizedUsername = username.replace(/[^\w.-]/g, '_').toLowerCase();
  
  const [emailCheck, usernameCheck] = await Promise.all([
  fetch(`${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users?email=${encodeURIComponent(email)}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }),
  fetch(`${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users?username=${encodeURIComponent(sanitizedUsername)}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  })
  ]);

  const emailUsers = await emailCheck.json();
  const usernameUsers = await usernameCheck.json();

  if (emailUsers.length > 0) {
    throw new Error('이미 존재하는 이메일입니다.');
  }
  if (usernameUsers.length > 0) {
    throw new Error('이미 존재하는 사용자명입니다.');
  }

  return false;
  };

  // keycloak 사용자 생성
  const createKeycloakUser = async (email: string, password: string, username: string, adminToken: string): Promise<void> => {
    const sanitizedUsername = username
      .replace(/[^\w.-]/g, '_') // 한글 사용 안됨 영어로 바꿔줌
      .toLowerCase();
  
    console.log('Original username:', username);
    console.log('Sanitized username:', sanitizedUsername);
  
    const userData = {
      username: sanitizedUsername,
      email,
      emailVerified: true,
      enabled: true,
      firstName: username, // 추후 손봐줘야할듯 회원가입페이지에 추가시키든
      lastName: username,
      attributes: {},
      credentials: [{
        type: 'password',
        value: password,
        temporary: false,
        createdDate: Date.now()
      }],
      requiredActions: []
    };
  
    try {
      const createUserUrl = `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users`;
      
      const response = await fetch(createUserUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const responseText = await response.text();
  
      if (response.ok) {
        if (response.status === 201) {
          const locationHeader = response.headers.get('Location');
          if (locationHeader) {
            const userId = locationHeader.split('/').pop();
            console.log('사용자 생성 완료, UserId:', userId);
            
          }
        }
      } else {
        if (response.status === 409) {
          throw new Error('이미 존재하는 사용자입니다.');
        }
        
        try {
          const errorData = JSON.parse(responseText);
          
          if (errorData.errorMessage) {
            throw new Error(`사용자 생성 실패: ${errorData.errorMessage}`);
          }
          if (errorData.field && errorData.field === 'username') {
            throw new Error('사용자명에 유효하지 않은 문자가 포함되어 있습니다. 영문, 숫자, 점, 언더스코어, 하이픈만 사용 가능합니다.');
          }
        } catch (parseError) {
          console.log('Non-JSON error response:', responseText);
        }
        
        throw new Error(`사용자 생성 실패: Status ${response.status} - ${responseText}`);
      }
  
    } catch (error) {
      console.error('키클락 유저 에러:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, username:string) => {
  try {
    setLoading(true);

    const adminToken = await getAdminToken();
    await checkUserExists(email, username, adminToken);
    await createKeycloakUser(email, password, username, adminToken);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await login(email, password);
      return {
        success: true,
        message: '회원가입 및 로그인이 완료되었습니다.',
        autoLogin: true
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
  } finally {
    setLoading(false);
  }
  };

  // PostgreSQL에 사용자 정보 동기화
  const syncUserToDatabase = async (userData: any) => {
    const syncEnabled = import.meta.env.VITE_SYNC_ENABLED === 'true';
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!syncEnabled) {
      return;
    }

    if (!apiBaseUrl || apiBaseUrl.includes('5173')) {
      return;
    }

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

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
  
      if (token && refreshToken) {
        const response = await fetch(keycloakUrls.logout, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
          },
          body: new URLSearchParams({
            client_id: keycloakConfig.clientId,
            refresh_token: refreshToken
          })
        });
  
        if (!response.ok) {
          console.error('Server logout failed:', response.status);
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
