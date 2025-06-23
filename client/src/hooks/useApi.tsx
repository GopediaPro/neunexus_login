// API 응답 타입 정의
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
}

// API 요청 옵션 타입
interface ApiOptions extends RequestInit {
  baseURL?: string;
  timeout?: number;
}

export const useApi = () => {
  // 기본 API 호출 함수
  const apiCall = async <T = any,>(
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const { baseURL = '', timeout = 10000, ...fetchOptions } = options;
      const fullUrl = baseURL ? `${baseURL}${url}` : url;

      // 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(fullUrl, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers
        },
        ...fetchOptions
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          error: 'Request timeout'
        };
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        error: errorMessage
      };
    } finally {
    }
  };

  // GET 요청
  const get = async <T = any,>(
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(url, { ...options, method: 'GET' });
  };

  // POST 요청
  const post = async <T = any,>(
    url: string,
    data?: any,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  };

  // PUT 요청
  const put = async <T = any,>(
    url: string,
    data?: any,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  };

  // PATCH 요청
  const patch = async <T = any,>(
    url: string,
    data?: any,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  };

  // DELETE 요청
  const del = async <T = any,>(
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    return apiCall<T>(url, { ...options, method: 'DELETE' });
  };

  // 폼 데이터 전송 (파일 업로드 등)
  const postForm = async <T = any,>(
    url: string,
    formData: FormData,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    const { headers, ...restOptions } = options;

    return apiCall<T>(url, {
      ...restOptions,
      method: 'POST',
      headers: {
        // FormData는 Content-Type을 자동으로 설정하므로 제거
        ...Object.fromEntries(
          Object.entries(headers || {}).filter(
            ([key]) => key.toLowerCase() !== 'content-type'
          )
        )
      },
      body: formData
    });
  };

  // Authorization 헤더 추가 헬퍼
  const withAuth = (token: string, tokenType: string = 'Bearer') => ({
    headers: {
      Authorization: `${tokenType} ${token}`
    }
  });

  return {
    apiCall,
    get,
    post,
    put,
    patch,
    del,
    postForm,
    withAuth
  };
};
