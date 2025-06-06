import ProductsPage from '@/app/products/page';

interface ProductsPageProps {
  params: {
    locale: string;
  };
}

export default function LocaleProductsPage({ params }: ProductsPageProps) {
  return <ProductsPage />;
} 