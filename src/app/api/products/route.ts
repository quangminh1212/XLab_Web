import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';

export async function GET(req: NextRequest) {
  try {
    // Get language from query parameter or default to Vietnamese
    const searchParams = req.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'vie';
    const categoryId = searchParams.get('categoryId');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Get products directory path based on language
    const productsDir = path.join(process.cwd(), `i8n/${lang}/product`);
    
    // Read all product files
    let productList: Product[] = [];
    try {
      const files = fs.readdirSync(productsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      productList = jsonFiles.map(file => {
        const filePath = path.join(productsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent) as Product;
      });
      
      console.log(`Retrieved ${productList.length} products from ${lang} files`);
    } catch (error) {
      console.error(`Error reading ${lang} product files:`, error);
      return NextResponse.json({ error: `Failed to read ${lang} product files` }, { status: 500 });
    }

    // Only get published products
    productList = productList.filter((p) => p.isPublished);
    console.log(`Found ${productList.length} published ${lang} products`);

    // Filter by categoryId if provided
    if (categoryId) {
      productList = productList.filter(
        (p) =>
          p.categories &&
          p.categories.some((cat) =>
            typeof cat === 'string' ? cat === categoryId : cat.id === categoryId,
          ),
      );
      console.log(`Filtered to ${productList.length} products in category ${categoryId}`);
    }

    // Exclude specific product if exclude is provided
    if (exclude) {
      productList = productList.filter((p) => p.id !== exclude && p.slug !== exclude);
      console.log(`Excluded product ${exclude}, remaining ${productList.length} products`);
    }

    // Limit results if limit is provided
    if (limit && !isNaN(limit)) {
      productList = productList.slice(0, limit);
      console.log(`Limited to ${productList.length} products`);
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
        (processedProduct as any).price = firstVersion.price;
        (processedProduct as any).originalPrice = firstVersion.originalPrice;

        // Calculate discount percentage if applicable
        if (firstVersion.originalPrice > firstVersion.price) {
          (processedProduct as any).discountPercentage = Math.round(
            (1 - firstVersion.price / firstVersion.originalPrice) * 100,
          );
        }
      }

      return processedProduct;
    });

    return NextResponse.json({
      success: true,
      data: processedProducts,
      total: processedProducts.length,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 },
    );
  }
}
