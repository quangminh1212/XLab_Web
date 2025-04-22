import { useState, useEffect } from 'react';

// Hook đơn giản để kiểm tra xem component đã mount ở client side chưa
export default function useMounted() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return mounted;
} 