'use client';

import dynamic from 'next/dynamic';

// Import the client component with SSR disabled and no loading component
const LanguageSwitcherClient = dynamic(
  () => import('./LanguageSwitcherClient'),
  { 
    ssr: false,
    loading: () => <div className="relative mr-2"></div>
  }
);

export default function NoSSRLanguageSwitcher({ className = '' }: { className?: string }) {
  // No Suspense - just render the dynamic component
  return <LanguageSwitcherClient className={className} />;
} 