import { Suspense } from 'react';
import ProductDetailPage from '@/app/products/[id]/page';

interface LocaleProductDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function LocaleProductDetail({ params }: LocaleProductDetailPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailPage params={{ id: params.id }} />
    </Suspense>
  );
} 