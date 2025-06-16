import React from 'react';

// This is a server component that provides a consistent shell with client
export default function LanguageSwitcher({ className }: { className?: string }): JSX.Element {
  // Return a simple div that matches the client structure, with suppressHydrationWarning
  return (
    <div className={`relative mr-2 ${className || ''}`.trim()} suppressHydrationWarning></div>
  );
} 