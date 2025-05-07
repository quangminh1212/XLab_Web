import { useLayoutEffect, useEffect } from 'react';

// Sử dụng useEffect trên server và useLayoutEffect trên client
// Giải quyết cảnh báo: "useLayoutEffect does nothing on the server"
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect; 