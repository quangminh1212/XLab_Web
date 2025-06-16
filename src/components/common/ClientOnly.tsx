'use client';

import { useEffect, useState } from 'react';

/**
 * Component that only renders its children on the client-side
 * This completely prevents hydration mismatches by not rendering anything during SSR
 */
export default function ClientOnly({ 
  children,
  fallback = null
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return fallback (or null) during SSR and first render cycle
  if (!isClient) {
    return fallback;
  }

  // Only render children on client after hydration is complete
  return <>{children}</>;
} 