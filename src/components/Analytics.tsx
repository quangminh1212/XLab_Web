'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Gửi sự kiện theo dõi lượt xem trang
      console.log('Page view:', pathname);
    }
  }, [pathname, searchParams]);

  return null;
} 