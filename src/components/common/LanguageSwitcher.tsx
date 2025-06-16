'use client';

import dynamic from 'next/dynamic';

// This is a placeholder div used during server rendering
// It MUST match the initial structure that the client component will render
function PlaceholderDiv({ className }: { className?: string }) {
  return <div className={`relative ${className}`}></div>;
}

// Import the client component with ssr:false option to completely skip server rendering
const ClientLanguageSwitcher = dynamic(
  () => import('./PureClientLanguageSwitcher'),
  { 
    ssr: false,
    loading: () => <PlaceholderDiv />
  }
);

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Use the placeholder during server rendering, which will be replaced by the client component
  return <PlaceholderDiv className={className} />;
} 