import { Suspense } from 'react';
import ProductDetailPage from '@/app/products/[id]/page';

interface LocaleProductDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default function LocaleProductDetail({ params }: LocaleProductDetailPageProps) {
  // Tạo promise để phù hợp với loại params mà ProductDetailPage mong đợi
  const productParams = Promise.resolve({ id: params.id });
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailPage params={productParams} />
    </Suspense>
  );
} 