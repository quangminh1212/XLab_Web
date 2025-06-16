'use client';

import React, { ReactNode, useEffect, useState } from 'react';

interface NoSSRProps {
  children: ReactNode;
}

export default function NoSSR({ children }: NoSSRProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
} 