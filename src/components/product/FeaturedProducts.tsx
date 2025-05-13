import Link from 'next/link';
import ProductGrid from './ProductGrid';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  isAccount?: boolean;
}

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  onAddToCart?: (id: string) => void;
  onProductView?: (id: string) => void;
}

const FeaturedProducts = ({
  products,
  title = 'Sản phẩm nổi bật',
  subtitle,
  viewAllLink = '/products',
  viewAllLabel = 'Xem tất cả sản phẩm',
  onAddToCart,
  onProductView,
}: FeaturedProductsProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            {title && <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>}
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="mt-4 sm:mt-0 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              {viewAllLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          )}
        </div>

        <ProductGrid
          products={products}
          onAddToCart={onAddToCart}
          onProductView={onProductView}
        />
      </div>
    </section>
  );
};

export default FeaturedProducts; 