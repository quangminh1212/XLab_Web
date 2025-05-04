import { useEffect, useLayoutEffect } from 'react';

/**
 * Custom hook thay thế useLayoutEffect với useEffect khi chạy trên server
 * Giải quyết cảnh báo: "useLayoutEffect does nothing on the server"
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect; 