import { NextResponse } from 'next/server';
import { products as mockProducts } from '@/data/mockData'; // Import mock data
import { Product } from '@/types';

// Reset productsData mỗi khi module được load (chỉ hữu ích trong dev)
let productsData = [...mockProducts];
console.log("[API /api/products] Initializing productsData with length:", productsData.length);

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
  console.log("[API /api/products] Received POST request");
  try {
    const body = await req.json();
    console.log("[API /api/products] Request body:", body);
    
    // Kiểm tra dữ liệu đầu vào
    if (!body.name || !body.price || !body.categoryId || !body.storeId) {
      console.error("[API /api/products] Missing required fields:", body);
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc (name, price, categoryId, storeId)' },
        { status: 400 }
      );
    }
    
    // Tạo sản phẩm mới
    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Thêm random để tránh trùng ID nếu gọi nhanh
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      description: body.description || '',
      longDescription: body.longDescription || '',
      price: Number(body.price),
      salePrice: Number(body.salePrice) || Number(body.price),
      categoryId: body.categoryId,
      imageUrl: body.imageUrl || '/images/placeholder-product.jpg',
      isFeatured: body.isFeatured || false,
      isNew: body.isNew === undefined ? true : body.isNew, // Mặc định là true nếu không có
      downloadCount: Number(body.downloadCount) || 0,
      viewCount: Number(body.viewCount) || 0,
      rating: Number(body.rating) || 0,
      version: body.version || '1.0.0',
      size: body.size || '0MB',
      licenseType: body.licenseType || 'Thương mại',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storeId: body.storeId
    };
    
    console.log("[API /api/products] Creating new product:", newProduct);
    
    // Thêm sản phẩm vào danh sách (mô phỏng database)
    productsData.push(newProduct);
    console.log("[API /api/products] productsData length after push:", productsData.length);
    
    // Trả về sản phẩm vừa tạo
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("[API /api/products] Error in POST handler:", error);
    return NextResponse.json(
      { error: 'Lỗi server khi tạo sản phẩm', details: error.message },
      { status: 500 }
    );
  }
} 