'use client';

import { useEffect, useState } from 'react';

/**
 * Component that ensures content is ONLY rendered on the client-side after hydration
 * Uses the strictest possible approach to prevent hydration mismatches
 */
export default function ClientOnly({ 
  children,
  fallback = null
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  // Using a ref would be more efficient but useState works too for this purpose
  const [hasMounted, setHasMounted] = useState(false);

  // Effect runs after hydration is complete
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // During SSR and initial client render before hydration completes, return fallback (usually null)
  if (!hasMounted) {
    return fallback;
  }

  // Only when we're fully mounted on the client, render the children
  return <>{children}</>;
} 