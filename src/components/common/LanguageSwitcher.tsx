import { Suspense } from 'react';

// This is a server component that renders a Suspense fallback
export default function LanguageSwitcher({ className }: { className?: string }): JSX.Element {
  return (
    <Suspense fallback={<div className="relative mr-2"></div>}>
      <div className="relative mr-2"></div>
    </Suspense>
  );
} 