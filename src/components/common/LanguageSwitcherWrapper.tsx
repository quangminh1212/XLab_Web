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
  
  if (!isMounted) {
    return <div className={`relative mr-2 ${className}`.trim()}></div>;
  }
  
  return <DynamicLanguageSwitcherClient className={className} />;
} 