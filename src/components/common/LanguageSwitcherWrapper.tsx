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
  
  // Use data-suppresshydrationwarning attribute to avoid hydration mismatch errors
  return (
    <div data-suppresshydrationwarning="true">
      {isMounted ? <DynamicLanguageSwitcherClient className={className} /> : null}
    </div>
  );
} 