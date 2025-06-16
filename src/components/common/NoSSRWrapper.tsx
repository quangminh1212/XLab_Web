'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Simple component that accepts children and renders them
const NoSSRComponent = (props: { children: React.ReactNode }) => <>{props.children}</>;

// Create a dynamic component with SSR disabled
const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
});

export default NoSSR; 