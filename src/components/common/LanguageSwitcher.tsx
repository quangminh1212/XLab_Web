'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import the actual implementation with SSR disabled
const LanguageSwitcherImpl = dynamic(() => import('./LanguageSwitcherClient'), {
  ssr: false,
  loading: () => <div className="relative mr-2"></div>
});

export default function LanguageSwitcher({ className = '' }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Return a placeholder with matching structure during SSR
  if (!isMounted) {
    return <div className={`relative mr-2 ${className}`.trim()}></div>;
  }
  
  // Once mounted on client, render the actual implementation
  return <LanguageSwitcherImpl className={className} />;
} 