'use client';

import { useEffect, useState, ReactNode } from 'react';

export interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component này đảm bảo chỉ render children phía client
 * Server sẽ render fallback (mặc định là null)
 */
export default function ClientOnly({
  children,
  fallback = null
}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback === null ? null : <>{fallback}</>;
  }

  return <>{children}</>;
} 