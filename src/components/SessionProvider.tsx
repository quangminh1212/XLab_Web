'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { errorLog } from '@/utils/debugHelper';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  try {
    return (
      <NextAuthSessionProvider>
        {children}
      </NextAuthSessionProvider>
    );
  } catch (error) {
    errorLog('Error in SessionProvider:', error);
    // Trả về children để vẫn hiển thị nội dung ngay cả khi SessionProvider lỗi
    return <>{children}</>;
  }
} 