'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/types';

interface RecentlyViewedContextType {
  recentProducts: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Tải danh sách sản phẩm đã xem từ localStorage khi component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProducts = localStorage.getItem('recentlyViewed');
        if (savedProducts) {
          setRecentProducts(JSON.parse(savedProducts));
        }
      } catch (error) {
        console.error('Failed to parse recently viewed products from localStorage:', error);
      }
      setLoaded(true);
    }
  }, []);

  // Lưu danh sách sản phẩm đã xem vào localStorage khi có thay đổi
  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentProducts));
    }
  }, [recentProducts, loaded]);

  // Thêm sản phẩm vào danh sách đã xem gần đây
  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentProducts(prev => {
      // Loại bỏ sản phẩm nếu đã tồn tại trong danh sách
      const filtered = prev.filter(p => p.id !== product.id);
      
      // Thêm sản phẩm mới vào đầu danh sách
      const updated = [product, ...filtered];
      
      // Giới hạn số lượng sản phẩm lưu trữ (tối đa 10)
      return updated.slice(0, 10);
    });
  }, []);

  // Xóa toàn bộ danh sách sản phẩm đã xem
  const clearRecentlyViewed = useCallback(() => {
    setRecentProducts([]);
  }, []);

  // Memoize context value để tránh re-renders không cần thiết
  const value = useMemo(() => ({
    recentProducts,
    addToRecentlyViewed,
    clearRecentlyViewed
  }), [recentProducts, addToRecentlyViewed, clearRecentlyViewed]);

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export default RecentlyViewedContext; 