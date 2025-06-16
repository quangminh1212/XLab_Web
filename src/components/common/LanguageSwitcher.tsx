'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Use a simpler client-only implementation with no SSR
const NoSSRLanguageSwitcher = dynamic(
  () => import('./NoHydrationLanguageSwitcher'),
  { 
    ssr: false,
    loading: () => <div className="h-8 w-16 bg-gray-100 rounded"></div>
  }
);

// This component is intentionally simple to avoid hydration mismatches
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <NoSSRLanguageSwitcher />
    </div>
  );
} 