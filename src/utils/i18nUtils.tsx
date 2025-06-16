'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Custom hook để sử dụng translations một cách an toàn với hydration
 * 
 * @param namespace Namespace cho các chuỗi dịch
 * @returns Object với các hàm utility để sử dụng translations
 */
export function useSafeTranslations(namespace?: string | string[]) {
  // Sử dụng namespace mặc định nếu không được cung cấp
  const namespaceToUse = namespace || 'common';
  const t = useTranslations(namespaceToUse);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hàm bọc an toàn để tránh lỗi hydration
  const safeTranslate = (key: string, params?: Record<string, any>): string => {
    if (typeof window === 'undefined' || !isMounted) {
      // Trên server hoặc trước khi component được mount, trả về key
      return key.split('.').pop() || key;
    }
    
    try {
      return t(key, params || {});
    } catch (error) {
      console.warn(`Translation key not found: ${key}`, error);
      return key.split('.').pop() || key;
    }
  };

  // Component để render text an toàn
  const SafeText: React.FC<{ 
    id: string; 
    params?: Record<string, any>; 
    className?: string 
  }> = ({ id, params, className }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);
    
    // Trong lần render server-side hoặc trước khi mount, trả về placeholder
    if (!mounted) {
      const fallbackText = id.split('.').pop() || id;
      return <span className={className} data-i18n-key={id}>{fallbackText}</span>;
    }
    
    try {
      return <span className={className}>{t(id, params || {})}</span>;
    } catch (error) {
      const fallbackText = id.split('.').pop() || id;
      return <span className={className}>{fallbackText}</span>;
    }
  };

  return {
    t: safeTranslate,
    SafeText,
    isMounted
  };
}

/**
 * HOC để bọc một component và đảm bảo nó chỉ được render ở client side
 */
export function withClientSideRendering<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  return function WithClientSideRendering(props: P) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      // Render một placeholder đơn giản khi ở server-side
      return <div className="client-render-placeholder"></div>;
    }

    return <Component {...props} />;
  };
} 