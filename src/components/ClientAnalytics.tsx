'use client';

import { Suspense } from 'react';
import Analytics from './Analytics';

export default function ClientAnalytics() {
  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  );
} 