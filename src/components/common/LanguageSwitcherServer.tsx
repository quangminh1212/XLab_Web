import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// We need to ensure the component is only imported on the client side
// Using dynamic import with ssr: false
const ClientLanguageSwitcher = dynamic(
  () => import('./SafeLanguageSwitcher'),
  { ssr: false }
);

// This is a server component that renders a simple container
// and then loads the client component dynamically
export default function LanguageSwitcherServer({ className = '' }: { className?: string }) {
  // On the server, just render a simple div with the right class
  return (
    <div className={`relative ${className || ''}`.trim()}>
      <Suspense>
        {/* This will only be rendered on the client */}
        <ClientLanguageSwitcher className={className} />
      </Suspense>
    </div>
  );
} 