import React from 'react';

// This is a server component that provides a consistent shell with client
export default function LanguageSwitcher({ className }: { className?: string }): JSX.Element {
  // Return just an empty div to match the client component's initial render
  return <div className={`relative mr-2 ${className || ''}`.trim()} />;
} 