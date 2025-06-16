'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import the client component with SSR disabled
const DynamicLanguageSwitcherClient = dynamic(
  () => import('./LanguageSwitcherClient'),
  { 
    ssr: false,
    loading: () => <div className="relative mr-2"></div>
  }
);

export default function LanguageSwitcherWrapper({ className = '' }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Use suppressHydrationWarning attribute to avoid hydration mismatch errors
  return (
    <div data-suppresshydrationwarning="true" suppressHydrationWarning>
      <DynamicLanguageSwitcherClient className={className} />
    </div>
  );
} 