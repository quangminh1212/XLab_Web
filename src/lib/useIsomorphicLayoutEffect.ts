import { useEffect, useLayoutEffect } from 'react';

/**
 * Custom hook sử dụng useLayoutEffect trên client và useEffect trên server
 * Giải quyết warning: "useLayoutEffect does nothing on the server"
 */
const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect; 