'use client';

import { useEffect, useState } from 'react';

/**
 * SuperStrict ensures absolutely no hydration mismatch by:
 * 1. Rendering nothing (null) during server-side rendering
 * 2. Continuing to render nothing during the first client render (hydration phase)
 * 3. Only rendering children after hydration is complete via useEffect
 */
export default function SuperStrict({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only render after client-side hydration is complete
  const [isMounted, setIsMounted] = useState(false);

  // Use useEffect to guarantee we only render after hydration
  useEffect(() => {
    // Using setTimeout to ensure we're completely past hydration
    // This is extra safe to avoid any chance of hydration mismatch
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Return null during SSR and during initial client render
  if (!isMounted) {
    return null;
  }

  // Only render children after hydration is fully complete
  return <>{children}</>;
} 