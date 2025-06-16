'use client';

import SuperStrict from './SuperStrict';

/**
 * A component that wraps children in a consistent SuperStrict pattern
 * It provides an empty container div during SSR and initial client render
 * then only renders the actual children after hydration is complete
 */
export default function SuperStrictWrapper({ 
  children, 
  className = '',
  tag = 'div'
}: { 
  children: React.ReactNode;
  className?: string;
  tag?: 'div' | 'span'
}) {
  // Use specified tag (div or span) for the empty container
  const Container = tag;
  
  return (
    <Container className={className}>
      <SuperStrict>
        {children}
      </SuperStrict>
    </Container>
  );
} 