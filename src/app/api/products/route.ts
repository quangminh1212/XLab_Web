import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';
import { products as rawMockProducts } from '@/data/mockData';
// Cast raw mock data (from types) to Product model defined structure
const mockProducts: Product[] = rawMockProducts as unknown as Product[];

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Fetch product list, falling back to mock data on error
function getProducts(): Product[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      console.warn('Products file not found, using mock data');
      return [...mockProducts];
    }
    const fileContentRaw = fs.readFileSync(dataFilePath, 'utf8');
    if (!fileContentRaw.trim()) {
      console.warn('Products file is empty, using mock data');
      return [...mockProducts];
    }
    // Sanitize raw JSON and parse
    let fileContent = fileContentRaw.replace(/[\r\n]+/g, ' ')
      .replace(/,(\s*[}\]])/g, '$1')
      .replace(/\\\\/g, '/');
    try {
      const parsed = JSON.parse(fileContent);
      return parsed;
    } catch (parseError) {
      console.error('Error parsing products data, falling back to mock data:', parseError);
      return [...mockProducts];
    }
  } catch (error) {
    console.error('Error reading products data, falling back to mock data:', error);
    return [...mockProducts];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    let productList = getProducts();
    console.log(`Retrieved ${productList.length} products from file`);
    
    // Chỉ lấy sản phẩm được xuất bản
    productList = productList.filter(p => p.isPublished);
    console.log(`Found ${productList.length} published products`);
    
    // Lọc theo categoryId nếu được cung cấp
    if (categoryId) {
      productList = productList.filter(p => 
        p.categories && p.categories.some(cat => 
          typeof cat === 'string' ? cat === categoryId : cat.id === categoryId
        )
      );
      console.log(`Filtered to ${productList.length} products in category ${categoryId}`);
    }
    
    // Loại trừ sản phẩm cụ thể nếu exclude được cung cấp
    if (exclude) {
      productList = productList.filter(p => p.id !== exclude && p.slug !== exclude);
      console.log(`Excluded product ${exclude}, remaining ${productList.length} products`);
    }
    
    // Giới hạn số lượng kết quả nếu limit được cung cấp
    if (limit && !isNaN(limit)) {
      productList = productList.slice(0, limit);
      console.log(`Limited to ${productList.length} products`);
    }
    
    // Xử lý blob URLs trong ảnh
    const processedProducts = productList.map(product => {
      const processedProduct = {
        ...product,
        images: Array.isArray(product.images) 
          ? product.images.map((img) => {
              if (typeof img === 'string') {
                return img.startsWith('blob:') ? '/images/placeholder/product-placeholder.jpg' : img;
              }
              return img.url;
            }) 
          : []
      };
      
      // Đảm bảo có giá của sản phẩm để hiển thị
      if (processedProduct.versions && processedProduct.versions.length > 0) {
        // Thêm các trường giá để tương thích với giao diện
        const firstVersion = processedProduct.versions[0];
        (processedProduct as any).price = firstVersion.price;
        (processedProduct as any).originalPrice = firstVersion.originalPrice;
        
        // Tính toán discount percentage nếu có
        if (firstVersion.originalPrice > firstVersion.price) {
          (processedProduct as any).discountPercentage = 
            Math.round((1 - (firstVersion.price / firstVersion.originalPrice)) * 100);
        }
      }
      
      return processedProduct;
    });
    
    return NextResponse.json({ 
      success: true, 
      data: processedProducts,
      total: processedProducts.length
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 