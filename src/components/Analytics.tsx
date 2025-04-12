'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      if (pathname) {
        // Lấy query string từ searchParams
        const queryString = searchParams ? 
          Array.from(searchParams.entries())
            .map(([key, value]) => `${key}=${value}`)
            .join('&') 
          : '';
        
        // Gửi sự kiện theo dõi lượt xem trang
        const pageUrl = queryString ? `${pathname}?${queryString}` : pathname;
        console.log('Page view:', pageUrl);
        
        // Tại đây có thể thêm code gửi dữ liệu analytics đến service như Google Analytics, etc.
        // sendAnalyticsData(pageUrl);
      }
    } catch (error) {
      // Xử lý lỗi một cách yên lặng để không làm ảnh hưởng đến trải nghiệm người dùng
      console.error('Analytics error:', error);
    }
  }, [pathname, searchParams]);

  return null;
} 