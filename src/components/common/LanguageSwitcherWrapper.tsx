'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import LanguageSwitcher with SSR disabled
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), { 
  ssr: false,
  loading: () => <div className="relative mr-2"></div>
});

export default function LanguageSwitcherWrapper() {
  return (
    <Suspense fallback={<div className="relative mr-2"></div>}>
      <LanguageSwitcher />
    </Suspense>
  );
} 