import ProductsPage from '@/app/products/page';

interface ProductsPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleProductsPage({ params }: ProductsPageProps) {
  // Truyền locale để hỗ trợ chuyển đổi ngôn ngữ
  return <ProductsPage />;
} 