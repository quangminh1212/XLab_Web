'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Component Analytics an toàn không sử dụng SearchParams
 * Để tránh lỗi "Search params not available during prerendering"
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Safe analytics tracking
    try {
      if (typeof window !== 'undefined') {
        const url = window.location.href;
        
        // Gửi dữ liệu phân tích khi route thay đổi
        console.log('Analytics tracked:', { pathname, url });

        // Gọi API phân tích (nếu cần)
        // fetch('/api/analytics', { 
        //   method: 'POST', 
        //   body: JSON.stringify({ pathname, url }) 
        // });
      }
    } catch (error) {
      // Bỏ qua lỗi trong môi trường development
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Analytics error:', error);
      }
    }
  }, [pathname]);

  // Component này không render gì, chỉ theo dõi analytics
  return null;
} 