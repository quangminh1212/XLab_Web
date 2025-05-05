'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface SearchParamsContextType {
  searchParams: URLSearchParams | null;
  getParam: (key: string) => string | null;
  hasParam: (key: string) => boolean;
  getAllParams: () => Record<string, string>;
}

const SearchParamsContext = React.createContext<SearchParamsContextType>({
  searchParams: null,
  getParam: () => null,
  hasParam: () => false,
  getAllParams: () => ({}),
});

export const useSearchParamsContext = () => React.useContext(SearchParamsContext);

// Wrapper nội bộ để xử lý lỗi bên trong server component
function SafeSearchParamsProvider({ children }: { children: React.ReactNode }) {
  // Kiểm tra môi trường Client để tránh lỗi
  const isClient = typeof window !== 'undefined';
  
  let safeSearchParams: URLSearchParams | null = null;
  let getParam = (_key: string): string | null => null;
  let hasParam = (_key: string): boolean => false;
  let getAllParams = (): Record<string, string> => ({});
  
  // Chỉ sử dụng React hooks trên client side
  if (isClient) {
    // Sử dụng hook component
    return <ClientSearchParamsProvider>{children}</ClientSearchParamsProvider>;
  }
  
  // Trên server side, trả về một provider với giá trị mặc định
  return (
    <SearchParamsContext.Provider value={{ searchParams: null, getParam, hasParam, getAllParams }}>
      {children}
    </SearchParamsContext.Provider>
  );
}

// Client component thực sự sử dụng hook
const ClientSearchParamsProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Chỉ truy cập searchParams sau khi đã mounted để tránh error hydration
  const safeSearchParams = isMounted ? searchParams : null;

  const getParam = (key: string): string | null => {
    if (!safeSearchParams) return null;
    return safeSearchParams.get(key);
  };

  const hasParam = (key: string): boolean => {
    if (!safeSearchParams) return false;
    return safeSearchParams.has(key);
  };

  const getAllParams = (): Record<string, string> => {
    if (!safeSearchParams) return {};
    const params: Record<string, string> = {};
    safeSearchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const contextValue = {
    searchParams: safeSearchParams,
    getParam,
    hasParam,
    getAllParams,
  };

  return (
    <SearchParamsContext.Provider value={contextValue}>
      {children}
    </SearchParamsContext.Provider>
  );
};

export const SearchParamsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SafeSearchParamsProvider>{children}</SafeSearchParamsProvider>
    </Suspense>
  );
};

export default SearchParamsWrapper; 