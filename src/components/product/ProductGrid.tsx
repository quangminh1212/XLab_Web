import ProductCard from './ProductCard';

interface OptionPrice {
  price: number;
  originalPrice: number;
}

interface ProductVersion {
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  features: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  isAccount?: boolean;
  versions?: ProductVersion[];
  optionPrices?: {[key: string]: OptionPrice};
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
  
  // Tính giá thấp nhất từ các phiên bản và tùy chọn
  const calculateMinPrice = (product: Product): number => {
    let minPrice = Infinity;
    
    // Kiểm tra các phiên bản
    if (product.versions && product.versions.length > 0) {
      product.versions.forEach(version => {
        if (version.price < minPrice) {
          minPrice = version.price;
        }
      });
    }
    
    // Kiểm tra các tùy chọn sản phẩm
    if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
      Object.values(product.optionPrices).forEach(option => {
        if (option.price < minPrice) {
          minPrice = option.price;
        }
      });
    }
    
    // Nếu có giá cố định
    if (product.price !== undefined && product.price < minPrice) {
      minPrice = product.price;
    }
    
    return minPrice === Infinity ? 0 : minPrice;
  };
  
  // Tính giá gốc tương ứng với giá thấp nhất
  const calculateOriginalPrice = (product: Product, minPrice: number): number | undefined => {
    let correspondingOriginalPrice;
    
    // Nếu giá thấp nhất từ version
    if (product.versions && product.versions.length > 0) {
      const version = product.versions.find(v => v.price === minPrice);
      if (version) {
        return version.originalPrice;
      }
    }
    
    // Nếu giá thấp nhất từ optionPrice
    if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
      for (const key in product.optionPrices) {
        if (product.optionPrices[key].price === minPrice) {
          return product.optionPrices[key].originalPrice;
        }
      }
    }
    
    // Sử dụng giá gốc cố định nếu có
    return product.originalPrice;
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
        {products.map((product) => {
          const minPrice = calculateMinPrice(product);
          const originalPrice = calculateOriginalPrice(product, minPrice);
          
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={minPrice}
              originalPrice={originalPrice}
              image={product.image}
              category={product.category}
              rating={product.rating}
              reviewCount={product.reviewCount}
              isAccount={product.isAccount}
              onAddToCart={onAddToCart}
              onView={onProductView}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid; 