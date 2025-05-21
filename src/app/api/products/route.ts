import { NextResponse } from 'next/server';
import { Product } from '@/models/ProductModel';
import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';

export async function GET(request: Request) {
  try {
    const dataFilePath = path.join(process.cwd(), 'src/data/products.json');
    let raw: string;
    try {
      raw = fs.readFileSync(dataFilePath, 'utf8');
    } catch (err) {
      console.error('Error reading products data file:', err);
      return NextResponse.json({ success: false, data: [], total: 0 }, { status: 500 });
    }
    let productList: Product[] = [];
    if (raw.trim()) {
      try {
        productList = JSON.parse(raw);
      } catch (jsonErr) {
        try {
          productList = JSON5.parse(raw);
        } catch (json5Err) {
          console.error('Error parsing products data with JSON and JSON5:', jsonErr, json5Err);
          productList = [];
        }
      }
    }
    // Now proceed with filtering and processing
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
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