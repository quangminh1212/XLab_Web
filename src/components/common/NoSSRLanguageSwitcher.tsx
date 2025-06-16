'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Import the client component with SSR disabled and no loading component
const LanguageSwitcherClient = dynamic(
  () => import('./LanguageSwitcherClient'),
  { 
    ssr: false,
    loading: () => <div className="relative mr-2"></div>
  }
);

export default function NoSSRLanguageSwitcher({ className = '' }: { className?: string }) {
  // Add suppressHydrationWarning to prevent hydration mismatch errors
  return (
    <div suppressHydrationWarning>
      <LanguageSwitcherClient className={className} />
    </div>
  );
} 