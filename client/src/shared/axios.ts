import axios, { type AxiosRequestConfig } from 'axios';
import { tokenManager } from '@/contexts/auth/tokenManager';
import { authApi } from '@/contexts/auth/authApi';

const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: false,
    timeout: 5000,
    ...config
  });

  axiosInstance.interceptors.request.use((request) => {
    const { accessToken } = tokenManager.getStoredTokens();
    request.headers.Authorization = `Bearer ${accessToken || ''}`;
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originRequest = error.config;
      const { accessToken, refreshToken } = tokenManager.getStoredTokens();

      if (error.response?.status === 401 && !originRequest._retry) {
        originRequest._retry = true;

        if (accessToken && refreshToken) {
          try {
            const tokenData = await authApi.refreshTokens();

            if (tokenData) {
              const { rememberMe } = tokenManager.getStoredTokens();
              tokenManager.saveTokens(
                tokenData.access_token,
                tokenData.refresh_token,
                rememberMe
              );

              originRequest.headers.Authorization = `Bearer ${tokenData.access_token}`;
              return axiosInstance.request(originRequest);
            } else {
              tokenManager.clearAuthData();
            }
          } catch (refreshError) {
            console.error('토큰 리프레시 실패:', refreshError);
            tokenManager.clearAuthData();
            window.location.href = '/login';
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();
