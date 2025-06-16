'use client';

import dynamic from 'next/dynamic';

// Static placeholder that matches the structure exactly
const StaticPlaceholder = ({ className = '' }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <button
      className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
      aria-expanded={false}
    >
      <div className="relative w-6 h-4 mr-2"></div>
      <span></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  </div>
);

// Import the client component with no SSR
const ClientComponent = dynamic(() => import('./PureClientLanguageSwitcher'), {
  ssr: false,
  loading: () => <StaticPlaceholder />
});

export default function SuperSafeLanguageSwitcher({ className = '' }: { className?: string }) {
  // Just use the static placeholder during SSR and the dynamic component on client
  return <ClientComponent className={className} />;
} 