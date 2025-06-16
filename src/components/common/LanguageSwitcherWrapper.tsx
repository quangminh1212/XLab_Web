'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import the client component with SSR disabled
const DynamicLanguageSwitcherClient = dynamic(
  () => import('./LanguageSwitcherClient'),
  { ssr: false }
);

export default function LanguageSwitcherWrapper({ className = '' }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Use suppressHydrationWarning to avoid hydration mismatch errors
  return (
    <div suppressHydrationWarning>
      {isMounted ? <DynamicLanguageSwitcherClient className={className} /> : null}
    </div>
  );
} 