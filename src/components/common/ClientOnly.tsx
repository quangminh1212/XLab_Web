'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hydration-safe rendering
  if (!isMounted) {
    // Simplest possible fallback
    return fallback ? (
      <div data-suppresshydrationwarning="true">{fallback}</div>
    ) : (
      <div data-suppresshydrationwarning="true"></div>
    );
  }

  // Wrap in a div with data-suppresshydrationwarning
  return <div data-suppresshydrationwarning="true">{children}</div>;
} 