'use client';

import dynamic from 'next/dynamic';

// Import client component with ssr disabled and return null during loading
const ClientOnly = dynamic(
  () => import('./PureClientLanguageSwitcher'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  return <ClientOnly className={className} />;
} 