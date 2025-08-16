import { NextRequest, NextResponse } from 'next/server';

import { getAllProducts } from '@/lib/i18n/products';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '0');
    const exclude = searchParams.get('exclude');
    const sort = searchParams.get('sort') || 'newest';
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    // Get language from header or query parameter (default to 'vie')
    const langParam = searchParams.get('lang');
    const acceptLanguage = req.headers.get('accept-language');
    const language = langParam || acceptLanguage || 'vie';

    // console.debug(`Getting products with language: ${language}`);

    // Get all products using i18n library
    const allProducts = await getAllProducts(language);
    
    // Filter by published status
    let productList = allProducts.filter((p) => p.isPublished !== false);

    // Filter by category if provided
    if (category) {
      productList = productList.filter((product) => {
        if (!product.categories) return false;
        // Handle both string array and object array formats
        return product.categories.some((cat: any) => {
          if (typeof cat === 'string') return cat === category;
          if ((cat as any).id) return (cat as any).id === category || (cat as any).slug === category;
          return false;
        });
      });
      // console.debug(`Filtered by category ${category}, found ${productList.length} products`);
    }

    // Filter by type if provided
    if (type) {
      productList = productList.filter((p) => p.type === type);
      // console.debug(`Filtered by type ${type}, found ${productList.length} products`);
    }

    // Filter by featured if provided
    if (featured === 'true') {
      productList = productList.filter((p) => (p as any).isFeatured === true);
      // console.debug(`Filtered by featured, found ${productList.length} products`);
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      productList = productList.filter((product) => {
        return (
          (product.name && product.name.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.shortDescription && product.shortDescription.toLowerCase().includes(searchLower))
        );
      });
      // console.debug(`Filtered by search "${search}", found ${productList.length} products`);
    }

    // Sort products
    if (sort === 'price-low') {
      productList.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === 'price-high') {
      productList.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (sort === 'popular') {
      productList.sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
    } else {
      // Default sort by newest
      productList.sort((a, b) => {
        const dateA = a.updatedAt || a.createdAt || '';
        const dateB = b.updatedAt || b.createdAt || '';
        return dateB.localeCompare(dateA);
      });
    }

    // Exclude specific product if exclude is provided
    if (exclude) {
      productList = productList.filter((p) => p.id !== exclude && p.slug !== exclude);
      // console.debug(`Excluded product ${exclude}, remaining ${productList.length} products`);
    }

    // Limit results if limit is provided
    if (limit && !isNaN(limit)) {
      productList = productList.slice(0, limit);
      // console.debug(`Limited to ${productList.length} products`);
    }

    // Process blob URLs in images
    const processedProducts = productList.map((product) => {
      const processedProduct = {
        ...product,
        images: Array.isArray(product.images)
          ? product.images.map((img) => {
              if (typeof img === 'string') {
                return img.startsWith('blob:')
                  ? '/images/placeholder/product-placeholder.jpg'
                  : img;
              }
              return img.url;
            })
          : [],
      };

      // Ensure product has price for display
      if (processedProduct.versions && processedProduct.versions.length > 0) {
        // Add price fields for compatibility with UI
        const firstVersion = processedProduct.versions[0];
        if (firstVersion) {
          (processedProduct as any).price = firstVersion.price;
          (processedProduct as any).originalPrice = firstVersion.originalPrice;

          // Calculate discount percentage if applicable
          if (firstVersion.originalPrice > firstVersion.price) {
            (processedProduct as any).discountPercentage = Math.round(
              (1 - firstVersion.price / firstVersion.originalPrice) * 100,
            );
          }
        }
      }

      return processedProduct;
    });

    return NextResponse.json({
      success: true,
      data: processedProducts,
      total: processedProducts.length,
    });
  } catch (_error) {
    // console.error('Error fetching products:', _error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Helper function to get product price
function getPrice(product: any): number {
  // Ưu tiên giá từ tùy chọn mặc định nếu có
  if (product.defaultProductOption && 
      product.optionPrices && 
      product.optionPrices[product.defaultProductOption]) {
    return product.optionPrices[product.defaultProductOption].price;
  }
  
  if (product.price) return product.price;
  if (product.versions && product.versions.length > 0) return product.versions[0].price;
  return 0;
}
