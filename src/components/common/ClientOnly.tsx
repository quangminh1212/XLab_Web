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

  // If not mounted, either return the fallback or derive a fallback from children
  if (!isMounted) {
    // If a fallback is provided, use it
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // For LanguageSwitcher specifically, we know the structure needed
    if (isValidElement(children) && 
        (children.type as any)?.name === 'LanguageSwitcherWrapper') {
      // Return a matching div structure
      return <div className="relative mr-2"></div>;
    }
    
    // For other components, return null to avoid hydration issues
    return null;
  }

  return <>{children}</>;
} 