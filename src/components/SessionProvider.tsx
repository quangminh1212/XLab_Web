'use client';

import { useEffect, useState } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // Log cho quá trình khởi tạo session
  useEffect(() => {
    console.log('SessionProvider mounted');
    
    // Kiểm tra cookie ngay từ đầu
    const checkCookies = () => {
      const cookies = document.cookie;
      console.log('Cookies available:', cookies);
      console.log('Has nextauth cookie:', cookies.includes('next-auth'));
    };
    
    checkCookies();
    
    // Cố gắng refresh session nhiều lần để đảm bảo
    const refreshSession = async () => {
      try {
        // Force refresh bằng visibility change
        document.dispatchEvent(new Event('visibilitychange'));
        console.log('Initial session refresh triggered');
        
        // Thêm một số lần refresh nữa với khoảng thời gian ngắn
        const intervals = [500, 1000, 2000, 3000];
        intervals.forEach(interval => {
          setTimeout(() => {
            try {
              document.dispatchEvent(new Event('visibilitychange'));
              console.log(`Session refresh at ${interval}ms triggered`);
              
              // Kiểm tra lại cookies sau mỗi lần refresh
              checkCookies();
            } catch (error) {
              console.error(`Error in session refresh at ${interval}ms:`, error);
            }
          }, interval);
        });
        
        // Đánh dấu đã khởi tạo session sau khi tất cả các lần refresh đã được lên lịch
        setTimeout(() => {
          setSessionInitialized(true);
          console.log('Session initialization completed');
        }, Math.max(...intervals) + 100);
      } catch (error) {
        console.error('Error in main session refresh logic:', error);
        setSessionInitialized(true); // Vẫn đánh dấu là đã khởi tạo để tránh treo
      }
    };
    
    refreshSession();
    
    // Kiểm tra và log lỗi nếu session không khởi tạo sau một khoảng thời gian
    const timeoutId = setTimeout(() => {
      if (!sessionInitialized) {
        console.error('Session initialization timeout - may indicate a problem with authentication');
        setSessionInitialized(true); // Force initialization để tránh treo
      }
    }, 5000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [sessionInitialized]);
  
  return (
    <NextAuthSessionProvider 
      refetchInterval={1} // Refresh mỗi giây
      refetchOnWindowFocus={true} // Refresh khi cửa sổ được focus
      // Không thể dùng refetchWhenOffline={true} vì API chỉ chấp nhận false
    >
      {children}
    </NextAuthSessionProvider>
  );
} 