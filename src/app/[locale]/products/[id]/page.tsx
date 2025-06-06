import ProductPage from '@/app/products/[id]/page';

interface LocaleProductDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function LocaleProductDetailPage({ params }: LocaleProductDetailPageProps) {
  // Trang ProductPage yêu cầu params là một Promise<{id: string}>
  return <ProductPage params={Promise.resolve({ id: params.id })} />;
} 