import { NextResponse } from 'next/server';
import { Product } from '@/models/ProductModel';
import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const lang = searchParams.get('lang') || 'vie'; // Default to Vietnamese

    // Get the localized products data
    const localesPath = path.join(process.cwd(), `src/locales/${lang}/products.json`);

    // Check if the locale file exists, if not fall back to Vietnamese
    const dataFilePath = fs.existsSync(localesPath)
      ? localesPath
      : path.join(process.cwd(), 'src/locales/vie/products.json');

    console.log(`Using products data from: ${dataFilePath}`);

    let productList: Product[] = [];

    try {
      // For Vietnamese locale, we need to extract the array part
      if (lang === 'vie') {
        const rawData = fs.readFileSync(dataFilePath, 'utf8');
        const jsonData = JSON.parse(rawData);

        // In Vietnamese locale, extract the actual product array data
        // First convert the object to an array of products
        productList = Object.entries(jsonData).map(([id, data]: [string, any]) => {
          return {
            id,
            name: data.name,
            slug: id,
            description: data.description,
            shortDescription: data.shortDescription,
            isPublished: true,
            images: ['/images/products/' + id + '/1.jpg'], // Default image path
            productOptions: data.productOptions || {},
            defaultProductOption: data.options || '',
            price: data.productOptions?.[Object.keys(data.productOptions)[0]]?.price || 0,
            originalPrice:
              data.productOptions?.[Object.keys(data.productOptions)[0]]?.originalPrice || 0,
            categories: [{ id: 'software', name: 'Phần mềm', slug: 'software' }], // Default category
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            weeklyPurchases: Math.floor(Math.random() * 20) + 5,
            rating: 4.5,
            requirements: [] as { type: 'system' | 'software' | 'hardware'; description: string }[],
            versions: [
              {
                name: Object.keys(data.productOptions || {})[0] || 'Standard',
                price: data.productOptions?.[Object.keys(data.productOptions)[0]]?.price || 0,
                originalPrice: data.productOptions?.[Object.keys(data.productOptions)[0]]?.originalPrice || 0,
              }
            ],
          };
        });
      } else {
        // For other locales, read directly
        const rawData = fs.readFileSync(dataFilePath, 'utf8');
        if (rawData.trim()) {
          try {
            productList = JSON.parse(rawData);
          } catch (jsonErr) {
            try {
              productList = JSON5.parse(rawData);
            } catch (json5Err) {
              console.error('Error parsing products data with JSON and JSON5:', jsonErr, json5Err);
              productList = [];
            }
          }
        }
      }
    } catch (err) {
      console.error('Error reading products data file:', err);
      return NextResponse.json({ success: false, data: [], total: 0 }, { status: 500 });
    }

    console.log(`Retrieved ${productList.length} products from file`);

    // Chỉ lấy sản phẩm được xuất bản
    productList = productList.filter((p) => p.isPublished !== false);
    console.log(`Found ${productList.length} published products`);

    // Lọc theo categoryId nếu được cung cấp
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

    // Loại trừ sản phẩm cụ thể nếu exclude được cung cấp
    if (exclude) {
      productList = productList.filter((p) => p.id !== exclude && p.slug !== exclude);
      console.log(`Excluded product ${exclude}, remaining ${productList.length} products`);
    }

    // Giới hạn số lượng kết quả nếu limit được cung cấp
    if (limit && !isNaN(limit)) {
      productList = productList.slice(0, limit);
      console.log(`Limited to ${productList.length} products`);
    }

    // Xử lý blob URLs trong ảnh
    const processedProducts = productList.map((product) => {
      // Create a deep copy to avoid modifying the original
      const processedProduct = {
        ...product,
        images: Array.isArray(product.images)
          ? product.images.map((img) => {
              if (typeof img === 'string') {
                return img.startsWith('blob:')
                  ? '/images/placeholder/product-placeholder.jpg'
                  : img;
              }
              return img.url || '/images/placeholder/product-placeholder.jpg';
            })
          : ['/images/placeholder/product-placeholder.jpg'],
      };

      // Đảm bảo có giá của sản phẩm để hiển thị
      if (processedProduct.versions && processedProduct.versions.length > 0) {
        // Thêm các trường giá để tương thích với giao diện
        const firstVersion = processedProduct.versions[0];
        (processedProduct as any).price = firstVersion.price;
        (processedProduct as any).originalPrice = firstVersion.originalPrice;

        // Tính toán discount percentage nếu có
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
