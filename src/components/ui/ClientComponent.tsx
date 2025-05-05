'use client';

import { useEffect, useState, ReactNode } from 'react';

export function ClientComponent({ children, fallback = null }: { 
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback;
  }

  return <>{children}</>;
}

export default ClientComponent; 