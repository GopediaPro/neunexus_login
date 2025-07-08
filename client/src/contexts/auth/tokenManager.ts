const tokenCache = new Map<string, { token: string; expires: number }>();

export const tokenManager = {
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
  },

  setTokenCache: (key: string, token: string, expires: number): void => {
    tokenCache.set(key, { token, expires });
  },

  getTokenCache: (key: string): { token: string; expires: number } | undefined => {
    return tokenCache.get(key);
  }
} as const;