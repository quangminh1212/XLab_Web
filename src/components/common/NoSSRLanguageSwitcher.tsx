'use client';

import dynamic from 'next/dynamic';
import ClientOnly from './ClientOnly';

// Import the client component with SSR disabled
const NoSSRLanguageSwitcherClient = dynamic(
  () => import('./LanguageSwitcherClient'),
  { ssr: false }
);

export default function NoSSRLanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <ClientOnly>
      <NoSSRLanguageSwitcherClient className={className} />
    </ClientOnly>
  );
} 