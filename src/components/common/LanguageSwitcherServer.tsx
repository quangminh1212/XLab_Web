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
  // Wrap the entire component in Suspense, not just the client component
  return (
    <Suspense fallback={<div className={`relative ${className || ''}`.trim()}></div>}>
      <ClientLanguageSwitcher className={className} />
    </Suspense>
  );
} 