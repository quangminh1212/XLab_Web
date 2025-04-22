'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import React from 'react';

// Tạo wrapper provider tránh SSR hydration mismatch với useLayoutEffect
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
    </React.Fragment>
  );
} 