'use client';

import { useEffect, useState, ReactNode, isValidElement, cloneElement } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Add suppressHydrationWarning to avoid hydration mismatches
  if (!isMounted) {
    // If a fallback is provided, use it
    if (fallback) {
      return <div suppressHydrationWarning>{fallback}</div>;
    }
    
    // For LanguageSwitcher specifically, we know the structure needed
    if (isValidElement(children) && 
        (children.type as any)?.name === 'LanguageSwitcherWrapper') {
      // Return a matching div structure with suppressHydrationWarning
      return <div suppressHydrationWarning className="relative mr-2"></div>;
    }
    
    // For other components, return null with suppressHydrationWarning
    return <div suppressHydrationWarning style={{ display: 'none' }}></div>;
  }

  return <div suppressHydrationWarning>{children}</div>;
} 