import { API_BASE_URL } from "@/constant/apiEndPoint";

const handleApiError = (error: any): never => {
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error('알 수 없는 오류가 발생했습니다.');
};

export const getProduct = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
    
  } catch (error) {
    console.error('상품 조회 API 오류:', error);
    handleApiError(error);
  }
};