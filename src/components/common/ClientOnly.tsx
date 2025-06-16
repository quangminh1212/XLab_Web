'use client';

import { useEffect, useState } from 'react';

/**
 * Component that ensures content is only rendered on the client-side
 * Uses the strictest possible approach to prevent hydration mismatches
 */
export default function ClientOnly({ 
  children,
  fallback = null
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  // This effect will only run once after client hydration is complete
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and initial client render, return fallback or null
  if (!isMounted) {
    return fallback;
  }

  // After hydration is complete on client, render children
  return <>{children}</>;
} 