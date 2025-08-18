import ProductCard from './ProductCard';
import { getDisplayPrices } from '@/features/products/services/pricing';
import { getValidImageUrl as getValidProductImageUrl } from '@/features/products/services/images';

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
  defaultProductOption?: string;
  productOptions?: string[];
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

  // Dùng shared pricing service thay cho logic nội bộ


  // Xử lý category từ sản phẩm
  const getCategoryString = (category: string | object | undefined): string | undefined => {
    if (!category) return undefined;
    
    if (typeof category === 'string') {
      return category;
    }

    if (typeof category === 'object' && category !== null) {
      const categoryObj = category as { name?: unknown; id?: unknown };
      
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

      <div className={`grid ${getColumnsClass()} gap-6`}>
        {products.map((product) => {
          // Extract category as string only
          let categoryString;
          
          if (product.category) {
            categoryString = getCategoryString(product.category);
          } else if (product.categories && product.categories.length > 0) {
            categoryString = getCategoryString(product.categories[0]);
          }

          // Determine the price based on default option if available
          let finalPrice = 0;
          let displayOriginalPrice = 0;
          
          // If product has a default option with price info, use that first
          if (product.defaultProductOption && 
              product.optionPrices && 
              product.optionPrices[product.defaultProductOption]) {
            const defaultOption = product.optionPrices[product.defaultProductOption];
            finalPrice = defaultOption?.price ?? 0;
            displayOriginalPrice = defaultOption?.originalPrice ?? 0;
            
            // If originalPrice is still not valid, calculate 80% discount
            if (!displayOriginalPrice || displayOriginalPrice <= finalPrice) {
              displayOriginalPrice = finalPrice * 5; // Create a fictional original price that's 5x the current price
            }
          } else {
            // Fall back to pricing service
            const prices = getDisplayPrices(product);
            finalPrice = prices.price;
            displayOriginalPrice = prices.originalPrice;
          }

          const safeProps = {
            key: String(product.id || ''),
            id: String(product.id || ''),
            name: String(product.name || ''),
            description: String(product.shortDescription || product.description || ''),
            price: Number(finalPrice) || 0,
            originalPrice: Number(displayOriginalPrice) || finalPrice * 5, // Always provide an originalPrice
            image: getValidProductImageUrl(product as any),
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

          // debug: Safe props computed

          return (
            <div key={safeProps.key} className="h-full flex">
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
