'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// This is just a placeholder div used while the real component loads
// It will be server-rendered and then replaced by client component
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
  // The client will replace the placeholder with ClientLanguageSwitcher after hydration
  return <ClientLanguageSwitcher className={className} />;
} 