import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';

// Data file path
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

// Read product data
function getProducts(): Product[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      console.log('Products file not found, creating empty file');
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    if (!fileContent.trim()) {
      console.log('Products file is empty, returning empty array');
      return [];
    }
    try {
      return JSON.parse(fileContent);
    } catch (parseError) {
      console.error('Error parsing products data:', parseError);
      // Attempt to sanitize unescaped newlines by removing them
      const sanitized = fileContent.replace(/(\r\n|\n|\r)/g, ' ');
      try {
        return JSON.parse(sanitized);
      } catch (sanitizedError) {
        console.error('Error parsing products data after sanitization:', sanitizedError);
        return [];
      }
    }
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
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