'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ScriptComponent from './ScriptComponent';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Gửi sự kiện theo dõi lượt xem trang
      console.log('Page view:', pathname);
      
      // Nếu cần gọi analytics thì gọi ở đây
      if (typeof window !== 'undefined' && window.gtag) {
        try {
          window.gtag('config', 'G-XXXXXXXXXX', {
            page_path: pathname,
          });
        } catch (e) {
          console.error('Analytics error:', e);
        }
      }
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Sử dụng ScriptComponent thay thế Script từ next/script */}
      <ScriptComponent
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <ScriptComponent
        id="google-analytics"
        strategy="afterInteractive"
        content={`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      />
    </>
  );
} 