'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'

export default function ClientSessionProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  const [mounted, setMounted] = useState(false);

  // Use useEffect to ensure client-side only execution
  useEffect(() => {
    setMounted(true);
  }, []);

  // Chỉ hiển thị SessionProvider trên client để tránh lỗi hydration
  if (!mounted) {
    return <>{children}</>;
  }

  // Trên client-side, bọc với SessionProvider
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 