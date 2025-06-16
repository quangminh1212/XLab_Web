'use client';

import dynamic from 'next/dynamic';

// Import the client component with SSR disabled and no loading component
const LanguageSwitcherClient = dynamic(
  () => import('./LanguageSwitcherClient'),
  { 
    ssr: false,
    loading: () => null 
  }
);

export default function NoSSRLanguageSwitcher({ className = '' }: { className?: string }) {
  return <LanguageSwitcherClient className={className} />;
} 