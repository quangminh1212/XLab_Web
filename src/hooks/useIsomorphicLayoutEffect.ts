import { useEffect, useLayoutEffect } from 'react';

/**
 * Một hook wrapper giúp giải quyết warning useLayoutEffect trên server
 * Sử dụng useLayoutEffect ở client và useEffect ở server
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect; 