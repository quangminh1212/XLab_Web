'use client';

import { useEffect, useState } from 'react';

/**
 * Component that renders ABSOLUTELY NOTHING on the server
 * This completely avoids hydration mismatches by not rendering anything during SSR
 */
export default function SuperStrict({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use state to track if we're on the client
  const [isMounted, setIsMounted] = useState(false);

  // This effect runs once after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null during SSR and initial client render
  if (!isMounted) {
    return null;
  }

  // Only render children after hydration is complete
  return <>{children}</>;
} 