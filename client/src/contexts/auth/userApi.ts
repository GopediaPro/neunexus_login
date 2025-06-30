import type { ICreateUserRequest } from "@/shared/types";
import { keycloakConfig } from '@/utils/keycloakConfig';

export const userApi = {
  checkEmailExists: async (email: string, adminToken: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${keycloakConfig.url}/admin/realms/${keycloakConfig.realm}/users?email=${encodeURIComponent(email)}`,
        {
          headers: { 
            'Authorization': `Bearer ${adminToken}`, 
            'Content-Type': 'application/json' 
          }
        }
      );

      if (!response.ok) {
        console.error('이메일 검색 실패:', response.status);
        return false;
      }

      const users = await response.json();
      return users.length > 0;
    } catch (error) {
      console.error('이메일 확인 에러:', error);
      return false;
    }
  },

  checkUserExists: async (
    email: string, 
    username: string, 
    adminToken: string
  ): Promise<void> => {
    const sanitizedUsername = userApi.sanitizeUsername(username);
    
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
  },

  sanitizeUsername: (username: string): string => {
    return username
      .replace(/[^\w.-]/g, '_') // 한글과 특수문자 언더스코어로 변경
      .toLowerCase();
  },

  createUserData: (
    email: string, 
    password: string, 
    username: string
  ): any => {
    const sanitizedUsername = userApi.sanitizeUsername(username);

    return {
      username: sanitizedUsername,
      email,
      emailVerified: true,
      enabled: true,
      firstName: username,
      lastName: username, // Keycloak 버그 방지용 (빈 문자열 사용 금지)
      attributes: {},
      credentials: [{
        type: 'password',
        value: password,
        temporary: false,
        createdDate: Date.now()
      }],
      requiredActions: []
    };
  },

  createKeycloakUser: async ({
    email,
    password,
    username,
    adminToken
  }: ICreateUserRequest): Promise<string> => {
    const userData = userApi.createUserData(email, password, username);

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
            return userId || '';
          }
        }
        return '';
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
      console.error('키클락 유저 생성 에러:', error);
      throw error;
    }
  }
} as const;