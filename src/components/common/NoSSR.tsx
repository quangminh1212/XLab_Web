'use client';

import React, { useEffect, useState } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
}

/**
 * Component loại bỏ hoàn toàn server-side rendering
 * Chỉ hiển thị children ở phía client sau khi mounted
 */
const NoSSR = ({ children }: NoSSRProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Không render gì ở phía server
  if (!isMounted) {
    return null;
  }

  // Chỉ render children ở phía client
  return <>{children}</>;
};

export default NoSSR; 