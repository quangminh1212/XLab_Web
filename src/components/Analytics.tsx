'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ScriptComponent from './ScriptComponent';

// Mở rộng interface Window để thêm gtag
declare global {
  interface Window {
    gtag: (command: string, id: string, config?: any) => void;
    dataLayer: any[];
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Kiểm tra xem có đang chạy trong trình duyệt không
    if (typeof window === 'undefined') {
      return; // Không thực hiện gì nếu đang trong môi trường server
    }

    // Kiểm tra dataLayer tồn tại
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    // Khởi tạo gtag nếu chưa tồn tại
    if (!window.gtag) {
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
    }

    if (pathname) {
      // Gửi sự kiện theo dõi lượt xem trang
      console.log('Page view:', pathname);
      
      // Kiểm tra window và gtag tồn tại
      if (window.gtag && typeof window.gtag === 'function') {
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