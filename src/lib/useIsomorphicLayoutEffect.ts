import { useEffect, useLayoutEffect } from 'react';

// Use useLayoutEffect on client side and useEffect on server side to prevent SSR warnings
const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect; 