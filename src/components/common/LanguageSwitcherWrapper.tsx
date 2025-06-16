'use client';

import React from 'react';
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
  return <DynamicLanguageSwitcherClient className={className} />;
} 