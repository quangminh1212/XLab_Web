'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Analytics() {
  const pathname = usePathname();
  // Bỏ qua searchParams vì gây lỗi
  // const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Gửi sự kiện theo dõi lượt xem trang
      console.log('Page view:', pathname);
    }
  }, [pathname]);

  return null;
} 