import { getDownFormOrdersPagination } from "@/api/order";
import { toast } from "sonner";

export const fetchOrdersByTemplate = async (templateCode: string) => {
  try {
    const response = await getDownFormOrdersPagination({
      page: 1,
      page_size: 200,
      template_code: templateCode,
    });

    const orderData = response.items?.map((item: any) => item.content) || [];
    
    return {
      success: true,
      data: orderData,
      count: orderData.length
    };
  } catch (error) {
    console.error('주문 데이터 조회 실패:', error);
    return {
      success: false,
      data: [],
      count: 0,
      error: error
    };
  }
};

export const validateOrderData = (orderData: any[]) => {
  if (orderData.length === 0) {
    toast.error('템플릿에 해당하는 주문 데이터가 없습니다.');
    return false;
  }
  
  return true;
};

export const showOrderLoadSuccess = (count: number) => {
  toast.dismiss();
  toast.success(`${count}개의 주문을 불러왔습니다.`);
};