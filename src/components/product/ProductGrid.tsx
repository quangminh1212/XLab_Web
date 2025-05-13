import ProductCard from './ProductCard';

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

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4 | 5;
  onAddToCart?: (id: string) => void;
  onProductView?: (id: string) => void;
}

const ProductGrid = ({
  products,
  title,
  subtitle,
  columns = 4,
  onAddToCart,
  onProductView,
}: ProductGridProps) => {
  // Set column classes based on the columns prop
  const getColumnsClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 5:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>
      )}

      <div className={`grid ${getColumnsClass()} gap-4 md:gap-6`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            category={product.category}
            rating={product.rating}
            reviewCount={product.reviewCount}
            isAccount={product.isAccount}
            onAddToCart={onAddToCart}
            onView={onProductView}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 