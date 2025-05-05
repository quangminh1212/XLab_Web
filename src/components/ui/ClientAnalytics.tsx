'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Component này xử lý phân tích dữ liệu người dùng và sự kiện client-side
 * Được bọc trong Suspense để tránh lỗi hydration với useSearchParams
 */
export default function ClientAnalytics() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Chỉ sử dụng analytics trong useEffect, đảm bảo chỉ chạy trên client
  useEffect(() => {
    setIsMounted(true);
    
    // Tracking page view
    if (pathname) {
      // Gửi dữ liệu phân tích khi route thay đổi
      try {
        const url = window.location.href;
        console.log('Page view:', { url, pathname });
        
        // Ở đây có thể gọi API phân tích hoặc Analytics service
        // sendAnalytics({ type: 'pageview', pathname, url });
      } catch (error) {
        // Bỏ qua lỗi trong môi trường phát triển
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Analytics error:', error);
        }
      }
    }
  }, [pathname]);

  // Component này không render gì, chỉ theo dõi phân tích
  return null;
} 