'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ScriptComponent from './ScriptComponent';
import { errorLog, safeExecute } from '@/utils/debugHelper';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Kiểm tra xem có đang chạy trong trình duyệt không
    if (typeof window === 'undefined') {
      return; // Không thực hiện gì nếu đang trong môi trường server
    }

    try {
      // Kiểm tra dataLayer tồn tại
      if (!window.dataLayer) {
        window.dataLayer = [];
      }

      // Khởi tạo gtag nếu chưa tồn tại
      if (!window.gtag) {
        window.gtag = function() {
          try {
            window.dataLayer.push(arguments);
          } catch (e) {
            errorLog('Lỗi khi push vào dataLayer', e);
          }
        };
      }

      if (pathname) {
        // Gửi sự kiện theo dõi lượt xem trang
        console.log('Page view:', pathname);
        
        // Kiểm tra window và gtag tồn tại
        if (window.gtag && typeof window.gtag === 'function') {
          safeExecute(() => {
            window.gtag('config', 'G-XXXXXXXXXX', {
              page_path: pathname,
            });
          }, 'gtag config');
        }
      }
    } catch (error) {
      errorLog('Lỗi trong Analytics useEffect', error);
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
          try {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          } catch(e) {
            console.error('Lỗi khởi tạo Google Analytics:', e);
          }
        `}
      />
    </>
  );
} 