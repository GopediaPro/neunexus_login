import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
}

interface ApiOptions extends AxiosRequestConfig {}

export const useApi = (customConfig?: Partial<ApiOptions>) => {
  // Axios 인스턴스 생성
  const api: AxiosInstance = axios.create({
    baseURL: customConfig?.baseURL || '',
    timeout: customConfig?.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(customConfig?.headers || {})
    },
    ...customConfig
  });

  // 응답 인터셉터 (예: 에러 핸들링)
  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  const apiCall = async <T = any,>(
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await api.request<T>({
        url,
        ...options
      });

      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      const isTimeout = axiosError.code === 'ECONNABORTED';
      const message = isTimeout
        ? 'Request timeout'
        : axiosError.message || 'Unknown error';

      return {
        error: message,
        status: axiosError.response?.status
      };
    }
  };

  const get = <T = any,>(url: string, options: ApiOptions = {}) =>
    apiCall<T>(url, { ...options, method: 'GET' });

  //post: 일반 JSON 데이터 전송
  const post = <T = any,>(url: string, data?: any, options: ApiOptions = {}) =>
    apiCall<T>(url, { ...options, method: 'POST', data });

  const put = <T = any,>(url: string, data?: any, options: ApiOptions = {}) =>
    apiCall<T>(url, { ...options, method: 'PUT', data });

  const patch = <T = any,>(url: string, data?: any, options: ApiOptions = {}) =>
    apiCall<T>(url, { ...options, method: 'PATCH', data });

  const del = <T = any,>(url: string, options: ApiOptions = {}) =>
    apiCall<T>(url, { ...options, method: 'DELETE' });

  //postForm: FormData 객체 그대로 전송 (ex.파일 업로드)
  const postForm = <T = any,>(
    url: string,
    formData: FormData,
    options: ApiOptions = {}
  ) =>
    apiCall<T>(url, {
      ...options,
      method: 'POST',
      data: formData,
      headers: {
        ...options.headers
        // Content-Type 생략해야 axios가 자동 설정
      }
    });

  return {
    apiCall,
    get,
    post,
    put,
    patch,
    del,
    postForm
  };
};
