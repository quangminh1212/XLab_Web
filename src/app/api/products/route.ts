import { NextResponse } from 'next/server';
import { products } from '@/data/mockData';
import { Product } from '@/types';

let productsData = [...products];

// GET - Lấy danh sách sản phẩm
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get('storeId');
  const categoryId = searchParams.get('categoryId');
  
  let filteredProducts = [...productsData];
  
  // Lọc sản phẩm theo cửa hàng nếu có
  if (storeId) {
    filteredProducts = filteredProducts.filter(product => 
      product.storeId.toString() === storeId
    );
  }
  
  // Lọc sản phẩm theo danh mục nếu có
  if (categoryId) {
    filteredProducts = filteredProducts.filter(product => 
      product.categoryId.toString() === categoryId
    );
  }
  
  return NextResponse.json(filteredProducts);
}

// POST - Thêm sản phẩm mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!body.name || !body.price || !body.categoryId || !body.storeId) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }
    
    // Tạo sản phẩm mới
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.description || '',
      longDescription: body.longDescription || '',
      price: body.price,
      salePrice: body.salePrice || body.price,
      categoryId: body.categoryId,
      imageUrl: body.imageUrl || '/images/placeholder-product.jpg',
      isFeatured: body.isFeatured || false,
      isNew: body.isNew || true,
      downloadCount: 0,
      viewCount: 0,
      rating: 0,
      version: body.version || '1.0.0',
      size: body.size || '0MB',
      licenseType: body.licenseType || 'Thương mại',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storeId: body.storeId
    };
    
    // Thêm sản phẩm vào danh sách
    productsData.push(newProduct);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi tạo sản phẩm' },
      { status: 500 }
    );
  }
} 