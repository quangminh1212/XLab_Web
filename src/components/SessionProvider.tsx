'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import useMounted from '@/lib/hooks/useMounted';

// Sử dụng dynamic import để tránh lỗi hydration  
const NextAuthSessionProvider = dynamic(
  () => import('next-auth/react').then(mod => mod.SessionProvider),
  { ssr: false } // Tắt server-side rendering
);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useMounted();
  
  // Chỉ render SessionProvider khi đã mount ở phía client
  if (!isMounted) {
    // Hiển thị nội dung nhưng không kết nối với session  
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
} 