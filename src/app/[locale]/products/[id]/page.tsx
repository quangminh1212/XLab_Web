import { Suspense } from 'react';
import ProductDetailPage from '@/app/products/[id]/page';

interface LocaleProductDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function LocaleProductDetail({ params }: LocaleProductDetailPageProps) {
  // Ensure params is awaited before accessing properties
  const safeParams = await Promise.resolve(params);
  const productId = safeParams.id;
  const locale = safeParams.locale;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailPage params={{ id: productId, locale: locale }} />
    </Suspense>
  );
} 