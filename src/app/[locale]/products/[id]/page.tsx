import { Suspense } from 'react';
import ProductDetailPage from '@/app/products/[id]/page';

interface LocaleProductDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default function LocaleProductDetail({ params }: LocaleProductDetailPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailPage params={Promise.resolve({ id: params.id })} />
    </Suspense>
  );
} 