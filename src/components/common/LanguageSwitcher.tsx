'use client';

import dynamic from 'next/dynamic';

// Completely disable SSR for this component
const ClientOnlyComponent = dynamic(() => import('./PureClientLanguageSwitcher'), {
  ssr: false,
  loading: () => <div></div>
});

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // This empty div will be rendered during SSR
  // The actual component will only render on the client
  return <ClientOnlyComponent className={className} />;
} 