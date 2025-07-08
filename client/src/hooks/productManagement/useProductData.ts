// import { useEffect, useRef, useState } from "react";
// import { type ColDef } from 'ag-grid-community';
// import { AgGridReact } from "ag-grid-react";
// import { useSidebar } from "@/contexts/SidebarContext";
import { useState } from "react";
import { productDummyData } from "@/mocks/dummy/product";
import type { ProductData } from "@/shared/types/product.types";

// 추후 사용코드들 기능 추가

export const useProductData = () => {
  const [productData, _setProductData] = useState<ProductData[]>(productDummyData);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  // const refreshProducts = async () => {
  //   setLoading(true);
  //   try {
  //     setError(null);
  //   } catch (err) {
  //     setError('상품 목록을 불러오는데 실패했습니다.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const addProduct = async (product: Omit<ProductData, 'id'>) => {
  //   setLoading(true);
  //   try {
  //     const newProduct = { ...product, id: Date.now().toString() };
  //     setProductData(prev => [...prev, newProduct]);
  //     setError(null);
  //     return newProduct;
  //   } catch (err) {
  //     setError('상품 추가에 실패했습니다.');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const updateProduct = async (id: string, updates: Partial<ProductData>) => {
  //   setLoading(true);
  //   try {
  //     setProductData(prev => 
  //       prev.map(product => 
  //         product.id === id ? { ...product, ...updates } : product
  //       )
  //     );
  //     setError(null);
  //   } catch (err) {
  //     setError('상품 수정에 실패했습니다.');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const deleteProduct = async (id: string) => {
  //   setLoading(true);
  //   try {
  //     setProductData(prev => prev.filter(product => product.id !== id));
  //     setError(null);
  //   } catch (err) {
  //     setError('상품 삭제에 실패했습니다.');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const deleteProducts = async (ids: string[]) => {
  //   setLoading(true);
  //   try {
  //     setProductData(prev => prev.filter(product => !ids.includes(product.id)));
  //     setError(null);
  //   } catch (err) {
  //     setError('상품 일괄 삭제에 실패했습니다.');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    productData,
    loading,
    error,
    
    // refreshProducts,
    // addProduct,
    // updateProduct,
    // deleteProduct,
    // deleteProducts,
  };
};