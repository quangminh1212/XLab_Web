import { SearchParamsWrapper } from '@/components/ui/SearchParamsWrapper';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Tải component client một cách động để tránh lỗi hydration
// @ts-ignore - Bỏ qua lỗi TypeScript vì chúng ta biết component này tồn tại
const ProductsClient = dynamic(() => import('./ProductsClient'), { 
  ssr: false,
  loading: () => <div className="p-4 border rounded animate-pulse">Đang tải danh sách sản phẩm...</div>
});

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Sản phẩm</h1>
      
      <Suspense fallback={<div className="p-4 border rounded">Đang tải danh sách sản phẩm...</div>}>
        <SearchParamsWrapper>
          <ProductsClient />
        </SearchParamsWrapper>
      </Suspense>
    </div>
  );
} 