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
      fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
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
    
    // Chỉ lấy sản phẩm được xuất bản
    productList = productList.filter(p => p.isPublished);
    
    // Lọc theo categoryId nếu được cung cấp
    if (categoryId) {
      productList = productList.filter(p => 
        p.categories && p.categories.some(cat => 
          typeof cat === 'string' ? cat === categoryId : cat.id === categoryId
        )
      );
    }
    
    // Loại trừ sản phẩm cụ thể nếu exclude được cung cấp
    if (exclude) {
      productList = productList.filter(p => p.id !== exclude && p.slug !== exclude);
    }
    
    // Giới hạn số lượng kết quả nếu limit được cung cấp
    if (limit && !isNaN(limit)) {
      productList = productList.slice(0, limit);
    }
    
    // Xử lý blob URLs trong ảnh
    const processedProducts = productList.map(product => ({
      ...product,
      images: product.images?.map((img) => {
        if (typeof img === 'string') {
          return img.startsWith('blob:') ? '/images/placeholder/product-placeholder.jpg' : img;
        }
        return img.url;
      }) || []
    }));
    
    return NextResponse.json({ success: true, data: processedProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 