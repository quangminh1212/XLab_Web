import { useLayoutEffect, useEffect } from 'react';

// Use useEffect on server and useLayoutEffect on client
// Resolves warning: "useLayoutEffect does nothing on the server"
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
export { useIsomorphicLayoutEffect };
