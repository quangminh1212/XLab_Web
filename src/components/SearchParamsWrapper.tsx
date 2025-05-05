'use client';

import React, { Suspense } from 'react';

// Component này dùng để bọc các component cần sử dụng useSearchParams
export default function SearchParamsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="animate-pulse min-h-screen"></div>}>
      {children}
    </Suspense>
  );
} 