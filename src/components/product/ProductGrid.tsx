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
  shortDescription?: string;
  price?: number;
  originalPrice?: number;
  image: string;
  category?: string | object;
  categories?: Array<string | { id: string | object; name: string | object; slug?: string | object }>;
  rating?: number;
  reviewCount?: number;
  totalSold?: number;
  isAccount?: boolean;
  slug?: string;
  versions?: ProductVersion[];
  optionPrices?: { [key: string]: OptionPrice };
  weeklyPurchases?: number;
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
      product.versions.forEach((version) => {
        if (version.price < minPrice) {
          minPrice = version.price;
        }
      });
    }

    // Kiểm tra các tùy chọn sản phẩm
    if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
      Object.values(product.optionPrices).forEach((option) => {
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
      const version = product.versions.find((v) => v.price === minPrice);
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

  // Xử lý category từ sản phẩm
  const getCategoryString = (category: string | object | undefined): string | undefined => {
    if (!category) return undefined;
    
    if (typeof category === 'string') {
      return category;
    }
    
    if (typeof category === 'object' && category !== null) {
      const categoryObj = category as any;
      
      // Try to get string representation from the category object
      if (categoryObj.name && typeof categoryObj.name === 'string') {
        return categoryObj.name;
      }
      
      if (categoryObj.id && typeof categoryObj.id === 'string') {
        return categoryObj.id;
      }
      
      return 'unknown';
    }
    
    return undefined;
  };

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-responsive">
          {title && <h2 className="heading-2 text-gray-800">{title}</h2>}
          {subtitle && <p className="mt-2 text-responsive-base text-gray-600">{subtitle}</p>}
        </div>
      )}

      <div className={`grid ${getColumnsClass()} gap-6 auto-rows-fr`}>
        {products.map((product) => {
          const minPrice = calculateMinPrice(product);
          const originalPrice = calculateOriginalPrice(product, minPrice);
          
          // Extract category as string only
          let categoryString;
          
          if (product.category) {
            categoryString = getCategoryString(product.category);
          } else if (product.categories && product.categories.length > 0) {
            categoryString = getCategoryString(product.categories[0]);
          }

          // Validate và đảm bảo tất cả props đều là primitive values
          const safeProps = {
            key: String(product.id || ''),
            id: String(product.id || ''),
            name: String(product.name || ''),
            description: String(product.shortDescription || product.description || ''),
            price: Number(minPrice) || 0,
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            image: String(product.image || ''),
            category: categoryString,
            rating: product.rating ? Number(product.rating) : undefined,
            reviewCount: product.reviewCount ? Number(product.reviewCount) : undefined,
            totalSold: product.totalSold ? Number(product.totalSold) : undefined,
            isAccount: Boolean(product.isAccount),
            slug: product.slug ? String(product.slug) : '',
            onAddToCart: onAddToCart,
            onView: onProductView,
            weeklyPurchases: product.weeklyPurchases ? Number(product.weeklyPurchases) : undefined,
          };

          console.log('ProductGrid - Safe props for', product.name, ':', safeProps);

          return (
            <div key={safeProps.key} className="h-full aspect-[1/1] flex">
              <ProductCard
                id={safeProps.id}
                name={safeProps.name}
                description={safeProps.description}
                price={safeProps.price}
                originalPrice={safeProps.originalPrice}
                image={safeProps.image}
                category={safeProps.category}
                rating={safeProps.rating}
                reviewCount={safeProps.reviewCount}
                totalSold={safeProps.totalSold}
                isAccount={safeProps.isAccount}
                slug={safeProps.slug}
                onAddToCart={safeProps.onAddToCart}
                onView={safeProps.onView}
                weeklyPurchases={safeProps.weeklyPurchases}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
