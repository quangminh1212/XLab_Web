'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the client component with SSR disabled and no loading component
const LanguageSwitcherClient = dynamic(
  () => import('./LanguageSwitcherClient'),
  { 
    ssr: false
  }
);

export default function NoSSRLanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <Suspense fallback={<div className="relative mr-2"></div>}>
      <LanguageSwitcherClient className={className} />
    </Suspense>
  );
} 