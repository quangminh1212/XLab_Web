import ProductPage from '@/app/products/[id]/page';

interface LocaleProductDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default function LocaleProductDetailPage({ params }: LocaleProductDetailPageProps) {
  // Chuyển id vào làm Promise<{id: string}> để phù hợp với kiểu dữ liệu của ProductPage
  const productParams = Promise.resolve({ id: params.id });
  return <ProductPage params={productParams} />;
} 