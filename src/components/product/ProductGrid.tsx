import React from 'react';
import ProductCard from './ProductCard';
import classNames from 'classnames';

interface OptionPrice {
  price: number;
  originalPrice?: number;
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
  price: number;
  originalPrice?: number;
  salePrice?: number;
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
  type?: string;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: number; // Số cột hiển thị
  onAddToCart?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function ProductGrid({
  products,
  title,
  subtitle,
  columns = 3,
  onAddToCart = () => {},
  onView = () => {},
}: ProductGridProps) {
  // Log products recieved
  console.log('ProductGrid - Received products:', products);
  
  // Allow product view handler
  const onProductView = (id: string) => {
    console.log('Product viewed:', id);
    onView(id);
  };

  // Get grid columns class based on columns prop
  const getColumnsClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 5:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }
  };

  // Calculate minimum price for products with versions
  const calculateMinPrice = (product: Product): number => {
    if (product.price && product.price > 0) {
      return product.price;
    }

    // If product has versions, get the minimum price
    if (product.versions && product.versions.length > 0) {
      const prices = product.versions.map((v) => v.price);
      return Math.min(...prices);
    }

    // If product has optionPrices, get the minimum price
    if (product.optionPrices) {
      const prices = Object.values(product.optionPrices).map((op) => op.price);
      if (prices.length > 0) {
        return Math.min(...prices);
      }
    }

    // If product has salePrice, use it
    if (product.salePrice && product.salePrice > 0) {
      return product.salePrice;
    }

    return 0;
  };

  // Calculate original price based on the min price
  const calculateOriginalPrice = (product: Product, minPrice: number): number | undefined => {
    if (product.originalPrice && product.originalPrice > 0) {
      return product.originalPrice;
    }

    // If min price comes from a version, get the corresponding original price
    if (product.versions && product.versions.length > 0) {
      const minVersion = product.versions.find((v) => v.price === minPrice);
      if (minVersion?.originalPrice) {
        return minVersion.originalPrice;
      }
    }

    // If min price comes from an option, get the corresponding original price
    if (product.optionPrices) {
      for (const option of Object.values(product.optionPrices)) {
        if (option.price === minPrice && option.originalPrice) {
          return option.originalPrice;
        }
      }
    }

    return undefined;
  };

  // Xử lý category từ sản phẩm
<<<<<<< HEAD
  const extractCategory = (product: Product): string | undefined => {
    // Nếu đã có category
    if (product.category) {
=======
  const extractCategory = (product: Product): string => {
    // Nếu đã có category
    if (product.category) {
      // Nếu category là string
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470
      if (typeof product.category === 'string') {
        return product.category;
      }
      
      // Nếu category là object
      if (typeof product.category === 'object' && product.category !== null) {
        const categoryObj = product.category as any;
<<<<<<< HEAD
        return categoryObj.name || categoryObj.id || undefined;
=======
        
        // Thử lấy tên từ object
        if (categoryObj.name) {
          if (typeof categoryObj.name === 'string') {
            return categoryObj.name;
          } else if (typeof categoryObj.name === 'object' && categoryObj.name !== null) {
            // Sử dụng as any để tránh lỗi TypeScript
            const nameObj = categoryObj.name as any;
            if (nameObj.id) {
              return String(nameObj.id);
            }
          }
        }
        
        // Thử lấy id từ object
        if (categoryObj.id) {
          if (typeof categoryObj.id === 'string') {
            return categoryObj.id;
          } else if (typeof categoryObj.id === 'object' && categoryObj.id !== null) {
            // Sử dụng as any để tránh lỗi TypeScript
            const idObj = categoryObj.id as any;
            if (idObj.id) {
              return String(idObj.id);
            }
          }
        }
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470
      }
    }
    
    // Nếu có categories array
    if (product.categories && Array.isArray(product.categories) && product.categories.length > 0) {
      const firstCategory = product.categories[0];
      if (typeof firstCategory === 'string') {
        return firstCategory;
      }
      
      if (typeof firstCategory === 'object' && firstCategory !== null) {
<<<<<<< HEAD
        const categoryObj = firstCategory as any;
        return categoryObj.name || categoryObj.id || undefined;
=======
        // Thử lấy tên từ object
        if (firstCategory.name) {
          if (typeof firstCategory.name === 'string') {
            return firstCategory.name;
          } else if (typeof firstCategory.name === 'object' && firstCategory.name !== null) {
            // Sử dụng as any để tránh lỗi TypeScript
            const nameObj = firstCategory.name as any;
            if (nameObj.id) {
              return String(nameObj.id);
            }
          }
        }
        
        // Thử lấy id từ object
        if (firstCategory.id) {
          if (typeof firstCategory.id === 'string') {
            return firstCategory.id;
          } else if (typeof firstCategory.id === 'object' && firstCategory.id !== null) {
            // Sử dụng as any để tránh lỗi TypeScript
            const idObj = firstCategory.id as any;
            if (idObj.id) {
              return String(idObj.id);
            }
          }
        }
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470
      }
    }
    
    // Nếu ko có category hoặc categories
    return product.type || 'AI-tools'; // Mặc định về AI-tools hoặc sử dụng type
  };

  // Render grid
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
          const minPrice = calculateMinPrice(product);
          const originalPrice = calculateOriginalPrice(product, minPrice);

          // Validate và đảm bảo tất cả props đều là primitive values
          const safeProps = {
            key: String(product.id || ''),
            id: String(product.id || ''),
            name: String(product.name || ''),
            description: String(product.shortDescription || product.description || ''),
            price: Number(minPrice) || 0,
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            image: String(product.image || ''),
            category: extractCategory(product), // Đảm bảo category luôn là string
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
}
