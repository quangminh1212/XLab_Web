'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Analytics() {
  const pathname = usePathname();
  
  // Sử dụng try-catch để tránh lỗi khi sử dụng useSearchParams mà không có Suspense
  let searchParamsString = '';
  try {
    const searchParams = useSearchParams();
    searchParamsString = searchParams ? searchParams.toString() : '';
  } catch (e) {
    // Bỏ qua lỗi khi prerendering
    console.debug('Search params not available during prerendering');
  }

  useEffect(() => {
    // Chỉ chạy ở client-side
    if (typeof window !== 'undefined' && pathname) {
      // Gửi sự kiện theo dõi lượt xem trang
      console.log('Page view:', pathname, searchParamsString);
    }
  }, [pathname, searchParamsString]);

  return null;
} 