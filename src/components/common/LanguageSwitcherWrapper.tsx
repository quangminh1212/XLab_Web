'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import LanguageSwitcherClient with SSR disabled
const LanguageSwitcherClient = dynamic(() => import('./LanguageSwitcherClient'), { 
  ssr: false,
  loading: () => <div className="relative mr-2"></div>
});

export default function LanguageSwitcherWrapper({ className = '' }: { className?: string }) {
  return <LanguageSwitcherClient className={className} />;
} 