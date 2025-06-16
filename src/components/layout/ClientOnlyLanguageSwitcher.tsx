'use client';

import { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
}

export default function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // During server rendering or before hydration is complete,
  // render an empty div with no content and no attributes
  if (!hasMounted) {
    return <div data-ssr-placeholder></div>;
  }

  // Render children only on the client side after hydration
  return <>{children}</>;
} 