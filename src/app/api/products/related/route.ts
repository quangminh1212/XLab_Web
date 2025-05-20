import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Đọc dữ liệu sản phẩm từ JSON file
const productsPath = path.join(process.cwd(), 'src/data/products.json');

export async function GET(request: NextRequest) {
  try {
    // Lấy các tham số từ URL
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const categoryId = searchParams.get('categoryId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 4;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID là bắt buộc' }, { status: 400 });
    }

    // Đọc dữ liệu từ file
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    // Tìm sản phẩm hiện tại để lấy thông tin
    const currentProduct = productsData.find((p: any) => p.id === productId || p.slug === productId);
    
    if (!currentProduct) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    let relatedProducts = [];
    
    // Nếu sản phẩm hiện tại có danh sách relatedProducts, ưu tiên lấy từ đây
    if (currentProduct.relatedProducts && currentProduct.relatedProducts.length > 0) {
      relatedProducts = productsData.filter((p: any) => 
        currentProduct.relatedProducts.includes(p.id) && p.id !== productId);
    } 
    // Nếu không, lấy sản phẩm từ cùng danh mục
    else if (categoryId) {
      relatedProducts = productsData.filter((p: any) => {
        const productCategories = p.categories || [];
        const hasCategory = productCategories.some((cat: any) => 
          typeof cat === 'string' ? cat === categoryId : cat.id === categoryId
        );
        return hasCategory && p.id !== productId;
      });
    }

    // Nếu vẫn không có, lấy các sản phẩm ngẫu nhiên
    if (relatedProducts.length === 0) {
      relatedProducts = productsData
        .filter((p: any) => p.id !== productId)
        .sort(() => 0.5 - Math.random());
    }

    // Giới hạn số lượng sản phẩm trả về
    relatedProducts = relatedProducts.slice(0, limit);

    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error('Lỗi khi xử lý sản phẩm liên quan:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
} 